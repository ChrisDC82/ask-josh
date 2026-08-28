import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "askjosh_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isUsableSessionSecret(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= 32;
}

export function createAdminSessionToken(secret: string, now = Date.now()) {
  if (!isUsableSessionSecret(secret)) {
    throw new Error("Admin session secret must contain at least 32 characters.");
  }

  const expiresAt = Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS;
  const nonce = randomBytes(18).toString("base64url");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${signature(payload, secret)}`;
}

export function isValidAdminSessionToken(
  token: string | undefined,
  secret: string | undefined,
  now = Date.now(),
) {
  if (!token || !isUsableSessionSecret(secret)) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAtValue, nonce, suppliedSignature] = parts;
  const expiresAt = Number(expiresAtValue);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) {
    return false;
  }

  const payload = `${expiresAtValue}.${nonce}`;
  const expectedSignature = signature(payload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function passwordsMatch(supplied: string, expected: string) {
  const suppliedDigest = createHash("sha256").update(supplied).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedDigest, expectedDigest);
}
