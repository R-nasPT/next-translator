import type { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { AUTH_SECRET } from "@/config/env";

/**
 * Retrieve token from NextAuth
 * @param request - Request object
 * @returns Promise<AuthToken | null>
 */
export async function getAuthToken(request: Request | NextRequest): Promise<JWT | null> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: AUTH_SECRET,
      cookieName:
        process.env.NODE_ENV === 'production'
          ? '__Secure-authjs.session-token'
          : 'authjs.session-token',
      secureCookie: process.env.NODE_ENV === 'production'
    });

    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Retrieve ID token
 * @param request - Request object
 * @returns Promise<string | null>
 */
export async function getIdToken(request: Request | NextRequest): Promise<string | null> {
  const token = await getAuthToken(request);
  
  if (token?.id_token) {
    return token.id_token;
  }
  
  return null;
}

/**
 * Retrieve refresh token
 * @param request - Request object
 * @returns Promise<string | null>
 */
export async function getRefreshToken(request: Request | NextRequest): Promise<string | null> {
  const token = await getAuthToken(request);
  if (token?.refresh_token) {
    return token.refresh_token;
  }
  
  return null;
}
