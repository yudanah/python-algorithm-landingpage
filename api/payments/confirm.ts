import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { confirmTossPayment } from '../_lib/toss.js';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const paymentKey = String(req.body?.paymentKey || '').trim();
  const orderId = String(req.body?.orderId || '').trim();
  const amount = Number(req.body?.amount || 0);

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ error: 'paymentKey, orderId, amount가 필요합니다.' });
  }

  const { data: existingPayment, error: paymentLookupError } = await supabaseAdmin
    .from('quote_payments')
    .select('id, quote_id, status')
    .eq('order_id', orderId)
    .single();

  if (paymentLookupError || !existingPayment) {
    return res.status(404).json({ error: '결제 세션을 찾지 못했습니다.' });
  }

  if (existingPayment.status === 'paid') {
    const { data: quote } = await supabaseAdmin
      .from('quotes')
      .select('public_token')
      .eq('id', existingPayment.quote_id)
      .single();

    return res.status(200).json({ success: true, alreadyConfirmed: true, publicToken: quote?.public_token || null });
  }

  try {
    const confirmed = await confirmTossPayment({ paymentKey, orderId, amount });

    const { data: quote } = await supabaseAdmin
      .from('quotes')
      .select('id, inquiry_id, public_token')
      .eq('id', existingPayment.quote_id)
      .single();

    await supabaseAdmin
      .from('quote_payments')
      .update({
        status: 'paid',
        method: confirmed.method || 'CARD',
        payment_key: confirmed.paymentKey,
        amount: confirmed.totalAmount || amount,
        approved_at: confirmed.approvedAt || new Date().toISOString(),
        receipt_url: confirmed.receipt?.url || null,
      })
      .eq('id', existingPayment.id);

    await supabaseAdmin
      .from('quotes')
      .update({ status: 'paid' })
      .eq('id', existingPayment.quote_id);

    if (quote?.inquiry_id) {
      await supabaseAdmin
        .from('contact_inquiries')
        .update({ status: 'paid' })
        .eq('id', quote.inquiry_id);
    }

    return res.status(200).json({
      success: true,
      publicToken: quote?.public_token || null,
      receiptUrl: confirmed.receipt?.url || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '결제 승인에 실패했습니다.';

    await supabaseAdmin
      .from('quote_payments')
      .update({
        status: 'failed',
        failure_reason: message,
        payment_key: paymentKey || null,
      })
      .eq('id', existingPayment.id);

    return res.status(400).json({ error: message });
  }
}
