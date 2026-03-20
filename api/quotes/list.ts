import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { sha256 } from '../_lib/quote-access.js';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  try {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const accessToken = String(req.body?.access_token || '').trim();

    if (!accessToken) {
      return res.status(400).json({ error: '접근 토큰이 필요합니다.' });
    }

    const { data: requests, error: requestError } = await supabaseAdmin
      .from('quote_access_requests')
      .select('id, email, org_name, normalized_org_name, access_expires_at')
      .eq('access_token_hash', sha256(accessToken))
      .limit(1);

    if (requestError) {
      console.error('Access token lookup failed:', requestError);
      return res.status(500).json({ error: '인증 상태 조회에 실패했습니다.' });
    }

    const accessRequest = requests?.[0];

    if (!accessRequest || !accessRequest.access_expires_at) {
      return res.status(401).json({ error: '유효한 인증 정보가 없습니다.' });
    }

    if (new Date(accessRequest.access_expires_at).getTime() < Date.now()) {
      return res.status(401).json({ error: '조회 세션이 만료되었습니다. 다시 인증해주세요.' });
    }

    const { data: quotes, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .select(`
        id,
        quote_number,
        title,
        org_name,
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
      .eq('access_email', accessRequest.email)
      .in('status', ['sent', 'approved', 'payment_pending', 'paid'])
      .order('issued_at', { ascending: false });

    if (quoteError) {
      console.error('Quote list lookup failed:', quoteError);
      return res.status(500).json({ error: '견적 조회에 실패했습니다.' });
    }

    const filteredQuotes = (quotes || []).filter(quote => {
      const normalizedQuoteOrgName = quote.org_name.replace(/\s+/g, '').trim().toLowerCase();
      return normalizedQuoteOrgName === accessRequest.normalized_org_name;
    });

    return res.status(200).json({ success: true, quotes: filteredQuotes });
  } catch (error) {
    console.error('Quote list handler failed:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : '견적 목록 조회 중 오류가 발생했습니다.' });
  }
}
