import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import {
  buildAccessExpiry,
  generateAccessToken,
  getAccessExpiryHours,
  normalizeEmail,
  normalizeOrgName,
  sha256,
} from '../_lib/quote-access.js';

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

    const orgName = String(req.body?.org_name || '').trim();
    const email = normalizeEmail(String(req.body?.email || ''));
    const code = String(req.body?.code || '').trim();

    if (!orgName || !email || code.length !== 6) {
      return res.status(400).json({ error: '기관명, 이메일, 인증번호를 확인해주세요.' });
    }

    const normalizedOrgName = normalizeOrgName(orgName);

    const { data: requests, error: requestError } = await supabaseAdmin
      .from('quote_access_requests')
      .select('id, code_hash, expires_at, failed_attempts, consumed_at')
      .eq('email', email)
      .eq('normalized_org_name', normalizedOrgName)
      .order('created_at', { ascending: false })
      .limit(1);

    if (requestError) {
      console.error('Access request lookup failed:', requestError);
      return res.status(500).json({ error: '인증 요청 조회에 실패했습니다.' });
    }

    const accessRequest = requests?.[0];

    if (!accessRequest) {
      return res.status(404).json({ error: '인증 요청을 먼저 진행해주세요.' });
    }

    if (accessRequest.consumed_at) {
      return res.status(400).json({ error: '이미 사용된 인증 요청입니다. 다시 시도해주세요.' });
    }

    if (new Date(accessRequest.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ error: '인증번호가 만료되었습니다. 다시 요청해주세요.' });
    }

    if (accessRequest.failed_attempts >= 5) {
      return res.status(429).json({ error: '인증번호 입력 횟수를 초과했습니다. 다시 요청해주세요.' });
    }

    if (sha256(code) !== accessRequest.code_hash) {
      await supabaseAdmin
        .from('quote_access_requests')
        .update({ failed_attempts: accessRequest.failed_attempts + 1 })
        .eq('id', accessRequest.id);

      return res.status(400).json({ error: '인증번호가 올바르지 않습니다.' });
    }

    const accessToken = generateAccessToken();
    const accessExpiresAt = buildAccessExpiry(getAccessExpiryHours());

    const { error: updateError } = await supabaseAdmin
      .from('quote_access_requests')
      .update({
        verified_at: new Date().toISOString(),
        consumed_at: new Date().toISOString(),
        access_token_hash: sha256(accessToken),
        access_expires_at: accessExpiresAt,
      })
      .eq('id', accessRequest.id);

    if (updateError) {
      console.error('Access request verify update failed:', updateError);
      return res.status(500).json({ error: '인증 처리에 실패했습니다.' });
    }

    return res.status(200).json({
      success: true,
      accessToken,
      accessExpiresAt,
    });
  } catch (error) {
    console.error('Quote verify handler failed:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : '견적 조회 인증 확인 중 오류가 발생했습니다.' });
  }
}
