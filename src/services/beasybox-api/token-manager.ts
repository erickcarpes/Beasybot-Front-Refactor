/**
 * Token Manager
 *
 * Manages access token in memory for security.
 * The refresh token is stored as an httpOnly cookie by the backend.
 */

let accessToken: null | string = null;

/**
 * Get the current access token.
 */
export function getAccessToken(): null | string {
  return accessToken;
}

/**
 * Set the access token after login or refresh.
 */
export function setAccessToken(token: null | string): void {
  accessToken = token;
}

/**
 * Clear the access token on logout.
 */
export function clearAccessToken(): void {
  accessToken = null;
}

/**
 * Check if user has a valid access token.
 */
export function hasAccessToken(): boolean {
  return accessToken !== null;
}

/**
 * Decode JWT payload to extract user ID.
 * Note: This does NOT validate the signature - that's the backend's job.
 */
export function decodeTokenPayload(token: string): { sub: string } | null {
  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return null;

    const payload = JSON.parse(atob(payloadBase64)) as { sub: string };
    return payload;
  } catch {
    return null;
  }
}
