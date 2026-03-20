import type { VercelRequest } from '@vercel/node';

export function validateAdminRequest(req: VercelRequest) {
  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!configuredKey) {
    return true;
  }

  const providedKey = req.headers['x-admin-key'];

  return typeof providedKey === 'string' && providedKey === configuredKey;
}
