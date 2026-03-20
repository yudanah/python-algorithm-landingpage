import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { validateAdminRequest } from '../_lib/admin-auth.js';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

async function handleGet(_req: VercelRequest, res: VercelResponse) {
  const { data, error } = await supabaseAdmin
    .from('contact_inquiries')
    .select(`
      id,
      org_name,
      manager_name,
      phone,
      email,
      org_type,
      student_count,
      desired_plan,
      desired_period,
      message,
      status,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Admin inquiries fetch failed:', error);
    return res.status(500).json({ error: '문의 목록을 불러오지 못했습니다.' });
  }

  return res.status(200).json({ success: true, inquiries: data || [] });
}

async function handlePatch(req: VercelRequest, res: VercelResponse) {
  const inquiryId = Number(req.body?.id);
  const status = String(req.body?.status || '').trim();

  if (!inquiryId || !status) {
    return res.status(400).json({ error: '문의 ID와 상태가 필요합니다.' });
  }

  const { error } = await supabaseAdmin
    .from('contact_inquiries')
    .update({ status })
    .eq('id', inquiryId);

  if (error) {
    console.error('Inquiry status update failed:', error);
    return res.status(500).json({ error: '문의 상태 변경에 실패했습니다.' });
  }

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

  if (req.method === 'PATCH') {
    return handlePatch(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
