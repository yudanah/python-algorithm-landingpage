import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { supabaseAdmin } from '../_lib/supabase.js';
import {
  buildExpiry,
  generateVerificationCode,
  getCodeExpiryMinutes,
  normalizeEmail,
  normalizeOrgName,
  sha256,
} from '../_lib/quote-access.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (!orgName || !email) {
      return res.status(400).json({ error: '기관명과 이메일을 입력해주세요.' });
    }

    const normalizedOrgName = normalizeOrgName(orgName);

    const { data: inquiries, error: inquiryError } = await supabaseAdmin
      .from('contact_inquiries')
      .select('id, org_name, email')
      .ilike('email', email)
      .limit(20);

    if (inquiryError) {
      console.error('Inquiry lookup failed:', inquiryError);
      return res.status(500).json({ error: '문의 정보 확인 중 오류가 발생했습니다.' });
    }

    const hasMatchingInquiry = (inquiries || []).some(inquiry => {
      const inquiryOrgName = normalizeOrgName(inquiry.org_name || '');
      const inquiryEmail = normalizeEmail(inquiry.email || '');
      return inquiryOrgName === normalizedOrgName && inquiryEmail === email;
    });

    if (!hasMatchingInquiry) {
      return res.status(404).json({ error: '일치하는 도입 문의 정보를 찾지 못했습니다.' });
    }

    const code = generateVerificationCode();
    const expiresAt = buildExpiry(getCodeExpiryMinutes());

    const { error: insertError } = await supabaseAdmin
      .from('quote_access_requests')
      .insert({
        org_name: orgName,
        normalized_org_name: normalizedOrgName,
        email,
        code_hash: sha256(code),
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error('Access request insert failed:', insertError);
      return res.status(500).json({ error: '인증 요청 저장에 실패했습니다.' });
    }

    try {
      const { error: emailError } = await resend.emails.send({
        from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
        to: email,
        subject: `[렛츠코딩] 견적 조회 인증번호 안내`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin-bottom: 12px;">견적 조회 인증번호</h2>
            <p><strong>${orgName}</strong> 기관의 견적 조회 요청이 접수되었습니다.</p>
            <p>아래 6자리 인증번호를 입력해주세요.</p>
            <div style="display:inline-block; margin: 16px 0; padding: 14px 20px; font-size: 28px; font-weight: 700; letter-spacing: 8px; background:#eff6ff; border-radius:12px; color:#1d4ed8;">
              ${code}
            </div>
            <p>인증번호는 ${getCodeExpiryMinutes()}분 후 만료됩니다.</p>
          </div>
        `,
      });

      if (emailError) {
        console.error('Quote access email send failed:', emailError);
        return res.status(500).json({ error: '인증 메일 발송에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Quote access email exception:', error);
      return res.status(500).json({ error: '인증 메일 발송 중 오류가 발생했습니다.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Quote access handler failed:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : '견적 조회 인증 요청 처리 중 오류가 발생했습니다.' });
  }
}
