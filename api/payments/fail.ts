import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';

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

  const code = String(req.body?.code || '').trim();
  const message = String(req.body?.message || '').trim();
  const orderId = String(req.body?.orderId || '').trim();

  if (!orderId) {
    return res.status(400).json({ error: 'orderId가 필요합니다.' });
  }

  const { data: payment } = await supabaseAdmin
    .from('quote_payments')
    .select('id')
    .eq('order_id', orderId)
    .single();

  if (payment?.id) {
    await supabaseAdmin
      .from('quote_payments')
      .update({
        status: 'failed',
        failure_code: code || null,
        failure_reason: message || null,
      })
      .eq('id', payment.id);
  }

  return res.status(200).json({ success: true });
}
