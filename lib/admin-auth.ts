import crypto from 'crypto'

export const COOKIE_NAME = 'admin_token'
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000 // 8 heures

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? 'admin-secret-change-me-in-production'
}

export function createToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS, v: 1 })
  const b64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(b64).digest('base64url')
  return `${b64}.${sig}`
}

export function verifyToken(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return false
    const [b64, sig] = parts
    const expectedSig = crypto.createHmac('sha256', getSecret()).update(b64).digest('base64url')
    const sigBuf = Buffer.from(sig, 'base64url')
    const expectedBuf = Buffer.from(expectedSig, 'base64url')
    if (sigBuf.length !== expectedBuf.length) return false
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'))
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? 'admin123'
  // Hash both to normalize length before constant-time comparison
  const inputHash = crypto.createHash('sha256').update(input).digest()
  const expectedHash = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(inputHash, expectedHash)
}
