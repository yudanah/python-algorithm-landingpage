import { Buffer } from 'node:buffer';

const TOSS_API_BASE = 'https://api.tosspayments.com/v1/payments';

export function getBaseUrl(req: { headers: Record<string, string | string[] | undefined> }) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host;
  const protocol = typeof forwardedProto === 'string' ? forwardedProto : 'https';
  const normalizedHost = Array.isArray(host) ? host[0] : host;
  return `${protocol}://${normalizedHost}`;
}

export function buildBasicAuth(secretKey: string) {
  return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
}

export async function confirmTossPayment(params: {
  paymentKey: string
  orderId: string
  amount: number
}) {
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TOSS_PAYMENTS_SECRET_KEY is not configured');
  }

  const response = await fetch(`${TOSS_API_BASE}/confirm`, {
    method: 'POST',
    headers: {
      Authorization: buildBasicAuth(secretKey),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey: params.paymentKey,
      orderId: params.orderId,
      amount: params.amount,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : '결제 승인에 실패했습니다.';
    throw new Error(message);
  }

  return data;
}
