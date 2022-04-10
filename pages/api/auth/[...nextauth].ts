import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET_KEY,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET_KEY || '',
    }),
  ],
  callbacks: {
    // redirect: async ({ url, baseUrl }) => baseUrl,
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   return true
    // },
    session: async ({ session, token, user }) => {
      const tag = session.user?.name?.replace(' ', '').toLocaleLowerCase()
      const uuid = token.sub
      session.user = { ...session.user, uuid, tag }
      return session
    },
  },
})
