import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: '전화번호와 문의 내용을 모두 입력해주세요.' });
  }

  try {
    // 1. Supabase에 저장
    const { error: dbError } = await supabase
      .from('contact_inquiries')
      .insert({ phone, message });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return res.status(500).json({ error: 'DB 저장 실패' });
    }

    // 2. Resend로 알림 이메일 발송
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: process.env.RESEND_FROM_EMAIL!,
      subject: `[도입문의] 새로운 문의가 접수되었습니다`,
      html: `
        <h2>새로운 도입문의</h2>
        <p><strong>전화번호:</strong> ${phone}</p>
        <p><strong>문의 내용:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Let's Coding & Play 랜딩페이지에서 접수된 문의입니다.
        </p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
