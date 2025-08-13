import NextAuth, { type NextAuthConfig } from 'next-auth';
import authConfig from './auth.config';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_ISSUER, AUTH_KEYCLOAK_SECRET, AUTH_SECRET } from './config/env';
import { fetchAuthInfo } from './services/endpoints/auth-info';

export const authOptions: NextAuthConfig = {
  ...authConfig,
  secret: AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      if (user && account?.provider === 'credentials') {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.id,
          authMethod: user.authMethod,
          roles: user.roles,
          accountId: user.accountId,
          iat: user.iat,
          exp: user.exp,
        };

        token.id_token = user.token;
        token.expires_at = user.exp;
      }

      if (account?.provider === 'keycloak') {
        token.id_token = account.id_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;

        const authInfo = await fetchAuthInfo(account.id_token!);
        
        if (authInfo) {
          token.user = {
            id: profile?.sub || account.providerAccountId,
            name: profile?.name,
            email: profile?.email,
            authMethod: 'keycloak',
            roles: authInfo.authInfo.roles,
            accountId: authInfo.accountId || account.providerAccountId,
            iat: profile?.iat,
            exp: profile?.exp,
          };
        } else {
          return null;
        }
      }

      if (Date.now() < (token.expires_at as number) * 1000) {
        return token;
      }

      if (token.refresh_token && token.user?.authMethod === 'keycloak') {
        console.info('Token expired, refreshing...');
        
        try {
          const response = await fetch(`${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
            method: 'POST',
            body: new URLSearchParams({
              client_id: AUTH_KEYCLOAK_ID!,
              client_secret: AUTH_KEYCLOAK_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token,
            }),
          });

          const refreshedTokens = await response.json();

          if (!response.ok) throw refreshedTokens;

          const refreshedToken = {
            ...token,
            id_token: refreshedTokens.id_token,
            expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
            refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
          };

          const authInfo = await fetchAuthInfo(refreshedToken.id_token);

          if (authInfo) {
            refreshedToken.user = {
              ...token.user,
              roles: authInfo.authInfo.roles,
              accountId: authInfo.accountId || token.user?.accountId,
            };
          }

          return refreshedToken;
        } catch (error) {
          console.error("Error refreshing id_token", error);
          token.error = "RefreshTokenError";
          return token;
        }
      }
      
      return token;
    },
    session: async ({ session, token }) => {
      session.error = token.error;
      session.user = token.user;
      session.expires = new Date(token.user.exp * 1000).toISOString() as unknown as Date & string;
      session.issuedAt = new Date(token.user.iat * 1000).toISOString() as unknown as Date & string;
      return session;
    },
  },
  events: {
    signOut: async (message) => {
      if ('token' in message && message.token?.id_token) {
        const logOutUrl = new URL(`${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`);
        logOutUrl.searchParams.set('id_token_hint', message.token.id_token);
        try {
          await fetch(logOutUrl);
        } catch (err) {
          console.error('Error during Keycloak logout:', err);
        }
      }
    },
  },
  logger: {
    error(error) {
      console.error('NextAuth Error:', error);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(message, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', message, metadata);
      }
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
