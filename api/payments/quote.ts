import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = String(req.query.token || '').trim();

  if (!token) {
    return res.status(400).json({ error: '견적 토큰이 필요합니다.' });
  }

  const { data, error } = await supabaseAdmin
    .from('quotes')
    .select(`
      id,
      quote_number,
      title,
      org_name,
      manager_name,
      access_email,
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
    .eq('public_token', token)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: '견적 정보를 찾지 못했습니다.' });
  }

  return res.status(200).json({ success: true, quote: data });
}
