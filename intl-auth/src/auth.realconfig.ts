import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from './types';
import { fetchIFPHost } from './services/baseUrl';
import { jwtDecode } from 'jwt-decode';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_ISSUER, AUTH_KEYCLOAK_SECRET } from './config/env';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from "next-auth/providers/keycloak";

interface CustomJwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': UserRole[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod': string;
  accountId?: string;
  iat: number;
  exp: number;
}

const KeycloakConfig = KeycloakProvider({
  clientId: AUTH_KEYCLOAK_ID,
  clientSecret: AUTH_KEYCLOAK_SECRET,
  issuer: AUTH_KEYCLOAK_ISSUER,
   authorization: {
    params: {
      scope: "openid profile email",
      kc_idp_hint: "microsoft"
    }
  },
});

const credentialsConfig = CredentialsProvider({
  name: 'credentials',
  credentials: {
    email: { label: 'email', type: 'text' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    const response = await fetchIFPHost('/auth/backoffice/login', {
      method: 'POST',
      body: JSON.stringify({
        username: credentials.email,
        password: credentials.password,
        appId: '3M1SmEH73ZLpdv0HIbU8lV',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      const decoded = jwtDecode<CustomJwtPayload>(result.token);
      const authUser = {
        token: result.token as string,
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        roles:decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        authMethod:decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod'],
        accountId: decoded.accountId,
        iat: decoded.iat,
        exp: decoded.exp,
      };

      return authUser;
    }

    return null;
  },
});

export default {
  providers: [credentialsConfig, KeycloakConfig],
  trustHost: true, // กำหนดเป็น true เพื่อให้ทุก host ที่ใช้เป็นที่เชื่อถือได้
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
