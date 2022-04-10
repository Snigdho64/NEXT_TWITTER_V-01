import 'next-auth'

/* Not sure if this is needed. */
declare module 'next-auth' {
  export interface Session {
    user: {
      uuid: string | undefined
      tag: string | undefined
      name: string
      email: string
      image: string
    }
  }
}
