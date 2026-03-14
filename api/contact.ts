import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFICATION_EMAIL = 'turbolady36@gmail.com';

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

  const {
    org_name,
    manager_name,
    phone,
    email,
    org_type,
    student_count,
    desired_plan,
    desired_period,
    message,
  } = req.body;

  if (!org_name || !manager_name || !phone || !org_type) {
    return res.status(400).json({ error: '기관명, 담당자 이름, 전화번호, 기관 유형은 필수 입력 항목입니다.' });
  }

  try {
    // 1. Supabase에 저장
    const { error: dbError } = await supabase
      .from('contact_inquiries')
      .insert({
        org_name,
        manager_name,
        phone,
        email: email || null,
        org_type,
        student_count: student_count || null,
        desired_plan: desired_plan || null,
        desired_period: desired_period || null,
        message: message || null,
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return res.status(500).json({ error: 'DB 저장 실패' });
    }

    // 2. Resend로 알림 이메일 발송 (실패해도 문의 접수는 완료)
    try {
      const { error: emailError } = await resend.emails.send({
        from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
        to: NOTIFICATION_EMAIL,
        subject: `[도입문의] 새로운 문의가 접수되었습니다`,
        html: `
          <h2>새로운 도입문의</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr style="background:#f5f5f5;">
              <th style="border:1px solid #ddd; padding:8px 12px; text-align:left; width:140px;">항목</th>
              <th style="border:1px solid #ddd; padding:8px 12px; text-align:left;">내용</th>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>기관명 *</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${org_name}</td>
            </tr>
            <tr style="background:#fafafa;">
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>담당자 이름 *</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${manager_name}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>전화번호 *</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${phone}</td>
            </tr>
            <tr style="background:#fafafa;">
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>이메일</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${email || '-'}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>기관 유형 *</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${org_type}</td>
            </tr>
            <tr style="background:#fafafa;">
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>학생 수</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${student_count || '-'}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>희망 플랜</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${desired_plan || '-'}</td>
            </tr>
            <tr style="background:#fafafa;">
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>희망 기간</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${desired_period || '-'}</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px 12px;"><strong>문의 내용</strong></td>
              <td style="border:1px solid #ddd; padding:8px 12px;">${message ? message.replace(/\n/g, '<br>') : '-'}</td>
            </tr>
          </table>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Let's Coding &amp; Play 랜딩페이지에서 접수된 문의입니다.
          </p>
        `,
      });
      if (emailError) {
        console.error('Resend email error:', emailError);
      }
    } catch (emailErr) {
      console.error('Resend send failed:', emailErr);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
