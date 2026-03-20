import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import { supabaseAdmin } from '../_lib/supabase.js';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function buildOrderId(quoteId: number) {
  return `LC-${quoteId}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = String(req.body?.token || '').trim();

  if (!token) {
    return res.status(400).json({ error: '견적 토큰이 필요합니다.' });
  }

  const { data: quote, error: quoteError } = await supabaseAdmin
    .from('quotes')
    .select('id, title, total_amount, currency, status, public_token')
    .eq('public_token', token)
    .single();

  if (quoteError || !quote) {
    return res.status(404).json({ error: '결제할 견적을 찾지 못했습니다.' });
  }

  if (!['sent', 'approved', 'payment_pending'].includes(quote.status)) {
    return res.status(400).json({ error: '현재 상태에서는 결제를 진행할 수 없습니다.' });
  }

  const orderId = buildOrderId(quote.id);

  const { error: insertError } = await supabaseAdmin
    .from('quote_payments')
    .insert({
      quote_id: quote.id,
      status: 'pending',
      amount: quote.total_amount,
      order_id: orderId,
      method: 'CARD',
    });

  if (insertError) {
    console.error('Payment session create failed:', insertError);
    return res.status(500).json({ error: '결제 세션 생성에 실패했습니다.' });
  }

  await supabaseAdmin
    .from('quotes')
    .update({ status: 'payment_pending' })
    .eq('id', quote.id);

  return res.status(200).json({
    success: true,
    orderId,
    orderName: quote.title,
    amount: quote.total_amount,
    currency: quote.currency,
  });
}
