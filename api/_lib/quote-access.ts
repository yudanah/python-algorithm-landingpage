import crypto from 'node:crypto';

const CODE_TTL_MINUTES = 10;
const ACCESS_TTL_HOURS = 12;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeOrgName(name: string) {
  return name.replace(/\s+/g, '').trim().toLowerCase();
}

export function generateVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function generateAccessToken() {
  return crypto.randomBytes(24).toString('hex');
}

export function generatePublicToken() {
  return crypto.randomBytes(18).toString('hex');
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function buildExpiry(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export function buildAccessExpiry(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function getCodeExpiryMinutes() {
  return CODE_TTL_MINUTES;
}

export function getAccessExpiryHours() {
  return ACCESS_TTL_HOURS;
}
