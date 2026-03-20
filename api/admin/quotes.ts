import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { validateAdminRequest } from '../_lib/admin-auth.js';
import { generatePublicToken, normalizeEmail, normalizeOrgName } from '../_lib/quote-access.js';
import { getBaseUrl } from '../_lib/toss.js';

interface QuoteItemInput {
  item_name: string
  description?: string
  quantity: number
  unit_price: number
  amount: number
}

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

function buildQuoteNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomPart = Math.floor(Math.random() * 9000 + 1000);
  return `QT-${datePart}-${randomPart}`;
}

async function getOrCreateOrganization(params: {
  inquiryId: number
  orgName: string
  email: string
  phone: string | null
  managerName: string | null
}) {
  const normalizedName = normalizeOrgName(params.orgName);
  const normalizedEmail = normalizeEmail(params.email);

  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('normalized_name', normalizedName)
    .eq('contact_email', normalizedEmail)
    .limit(1);

  if (existing?.[0]?.id) {
    return existing[0].id as number;
  }

  const { data: created, error: createError } = await supabaseAdmin
    .from('organizations')
    .insert({
      inquiry_id: params.inquiryId,
      name: params.orgName,
      normalized_name: normalizedName,
      contact_email: normalizedEmail,
      contact_phone: params.phone,
      manager_name: params.managerName,
    })
    .select('id')
    .single();

  if (createError || !created) {
    throw createError || new Error('organization create failed');
  }

  return created.id as number;
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const inquiryId = Number(req.query.inquiry_id);

  if (!inquiryId) {
    return res.status(400).json({ error: 'inquiry_id가 필요합니다.' });
  }

  const { data, error } = await supabaseAdmin
    .from('quotes')
    .select(`
      id,
      inquiry_id,
      quote_number,
      title,
      org_name,
      access_email,
      manager_name,
      status,
      issued_at,
      valid_until,
      currency,
      subtotal_amount,
      discount_amount,
      tax_amount,
      total_amount,
      notes,
      payment_url,
      public_token,
      created_at,
      quote_payments (
        id,
        status,
        method,
        amount,
        approved_at,
        receipt_url,
        created_at
      ),
      quote_items (
        id,
        sort_order,
        item_name,
        description,
        quantity,
        unit_price,
        amount
      )
    `)
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin quotes fetch failed:', error);
    return res.status(500).json({ error: '견적 목록을 불러오지 못했습니다.' });
  }

  return res.status(200).json({ success: true, quotes: data || [] });
}

async function syncInquiryStatus(inquiryId: number, quoteStatus: string) {
  const inquiryStatus =
    quoteStatus === 'paid'
      ? 'paid'
      : quoteStatus === 'payment_pending'
        ? 'payment_pending'
        : 'quoted';

  await supabaseAdmin
    .from('contact_inquiries')
    .update({ status: inquiryStatus })
    .eq('id', inquiryId);
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  const {
    inquiry_id,
    title,
    access_email,
    manager_name,
    status,
    issued_at,
    valid_until,
    currency,
    subtotal_amount,
    discount_amount,
    tax_amount,
    total_amount,
    notes,
    payment_url,
    items,
  } = req.body || {};

  if (!inquiry_id || !title || !access_email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '문의, 견적명, 이메일, 견적 항목은 필수입니다.' });
  }

  const inquiryId = Number(inquiry_id);
  const normalizedEmail = normalizeEmail(String(access_email));

  const { data: inquiry, error: inquiryError } = await supabaseAdmin
    .from('contact_inquiries')
    .select('id, org_name, manager_name, phone, email')
    .eq('id', inquiryId)
    .single();

  if (inquiryError || !inquiry) {
    return res.status(404).json({ error: '문의 정보를 찾지 못했습니다.' });
  }

  const organizationId = await getOrCreateOrganization({
    inquiryId,
    orgName: inquiry.org_name || '기관명 미확인',
    email: normalizedEmail,
    phone: inquiry.phone || null,
    managerName: manager_name || inquiry.manager_name || null,
  });

  const quoteNumber = buildQuoteNumber();
  const publicToken = generatePublicToken();
  const baseUrl = getBaseUrl(req as unknown as { headers: Record<string, string | string[] | undefined> });
  const paymentPageUrl = payment_url || `${baseUrl}/pay?token=${publicToken}`;

  const { data: quote, error: quoteError } = await supabaseAdmin
    .from('quotes')
    .insert({
      organization_id: organizationId,
      inquiry_id: inquiryId,
      quote_number: quoteNumber,
      title,
      org_name: inquiry.org_name,
      access_email: normalizedEmail,
      manager_name: manager_name || inquiry.manager_name || null,
      status: status || 'sent',
      issued_at: issued_at || new Date().toISOString(),
      valid_until: valid_until || null,
      currency: currency || 'KRW',
      subtotal_amount: subtotal_amount || 0,
      discount_amount: discount_amount || 0,
      tax_amount: tax_amount || 0,
      total_amount: total_amount || 0,
      notes: notes || null,
      payment_url: paymentPageUrl,
      public_token: publicToken,
    })
    .select('id')
    .single();

  if (quoteError || !quote) {
    console.error('Quote create failed:', quoteError);
    return res.status(500).json({ error: '견적 생성에 실패했습니다.' });
  }

  const itemRows = (items as QuoteItemInput[]).map((item, index) => ({
    quote_id: quote.id,
    sort_order: index,
    item_name: item.item_name,
    description: item.description || null,
    quantity: Number(item.quantity) || 1,
    unit_price: Number(item.unit_price) || 0,
    amount: Number(item.amount) || 0,
  }));

  const { error: itemError } = await supabaseAdmin.from('quote_items').insert(itemRows);

  if (itemError) {
    console.error('Quote items create failed:', itemError);
    return res.status(500).json({ error: '견적 항목 저장에 실패했습니다.' });
  }

  await syncInquiryStatus(inquiryId, status || 'sent');

  return res.status(201).json({ success: true, quoteId: quote.id, quoteNumber });
}

async function handlePatch(req: VercelRequest, res: VercelResponse) {
  const {
    id,
    title,
    access_email,
    manager_name,
    status,
    issued_at,
    valid_until,
    subtotal_amount,
    discount_amount,
    tax_amount,
    total_amount,
    notes,
    payment_url,
    items,
  } = req.body || {};

  const quoteId = Number(id);

  if (!quoteId || !title || !access_email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '견적 ID, 견적명, 이메일, 견적 항목은 필수입니다.' });
  }

  const { data: existingQuote, error: existingError } = await supabaseAdmin
    .from('quotes')
    .select('id, inquiry_id')
    .eq('id', quoteId)
    .single();

  if (existingError || !existingQuote) {
    return res.status(404).json({ error: '수정할 견적을 찾지 못했습니다.' });
  }

  const { error: quoteError } = await supabaseAdmin
    .from('quotes')
    .update({
      title,
      access_email: normalizeEmail(String(access_email)),
      manager_name: manager_name || null,
      status: status || 'sent',
      issued_at: issued_at || null,
      valid_until: valid_until || null,
      subtotal_amount: subtotal_amount || 0,
      discount_amount: discount_amount || 0,
      tax_amount: tax_amount || 0,
      total_amount: total_amount || 0,
      notes: notes || null,
      payment_url: payment_url || null,
    })
    .eq('id', quoteId);

  if (quoteError) {
    console.error('Quote update failed:', quoteError);
    return res.status(500).json({ error: '견적 수정에 실패했습니다.' });
  }

  await supabaseAdmin.from('quote_items').delete().eq('quote_id', quoteId);

  const itemRows = (items as QuoteItemInput[]).map((item, index) => ({
    quote_id: quoteId,
    sort_order: index,
    item_name: item.item_name,
    description: item.description || null,
    quantity: Number(item.quantity) || 1,
    unit_price: Number(item.unit_price) || 0,
    amount: Number(item.amount) || 0,
  }));

  const { error: itemError } = await supabaseAdmin.from('quote_items').insert(itemRows);

  if (itemError) {
    console.error('Quote item replace failed:', itemError);
    return res.status(500).json({ error: '견적 항목 수정에 실패했습니다.' });
  }

  await syncInquiryStatus(existingQuote.inquiry_id, status || 'sent');

  return res.status(200).json({ success: true });
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const quoteId = Number(req.query.id);

  if (!quoteId) {
    return res.status(400).json({ error: '삭제할 견적 ID가 필요합니다.' });
  }

  const { data: quote, error: quoteLookupError } = await supabaseAdmin
    .from('quotes')
    .select('id, inquiry_id')
    .eq('id', quoteId)
    .single();

  if (quoteLookupError || !quote) {
    return res.status(404).json({ error: '삭제할 견적을 찾지 못했습니다.' });
  }

  const { error } = await supabaseAdmin.from('quotes').delete().eq('id', quoteId);

  if (error) {
    console.error('Quote delete failed:', error);
    return res.status(500).json({ error: '견적 삭제에 실패했습니다.' });
  }

  await supabaseAdmin
    .from('contact_inquiries')
    .update({ status: 'contacted' })
    .eq('id', quote.inquiry_id);

  return res.status(200).json({ success: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!validateAdminRequest(req)) {
    return res.status(401).json({ error: '관리자 인증에 실패했습니다.' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  if (req.method === 'PATCH') {
    return handlePatch(req, res);
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
