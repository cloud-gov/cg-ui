import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    {
      id: 'uaa',
      name: 'uaa',
      // could be oauth instead if we need the scopes?
      // see https://github.com/nextauthjs/next-auth/discussions/6130
      type: 'oidc',
      clientId: 'nextjs_client',
      clientSecret: 'nextjs_client_secret',
      wellKnown: 'http://localhost:9000/.well-known/openid-configuration',
      issuer: 'http://localhost:8080/uaa/oauth/token',
      authorization: {
        params: {
          scope: 'openid'
        },
        url: 'http://localhost:9000/oauth/authorize'
      },
      token: 'http://localhost:9000/oauth/token',
      userinfo: 'http://localhost:9000/userinfo',
      client: {
        authorization_signed_response_alg: 'HS256',
        id_token_signed_response_alg: 'HS256'
      }
    }
  ],
  jwt: {
    encryption: true
  },
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") {
        return !!auth
      }
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
