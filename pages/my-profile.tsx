import { NextPage, NextPageContext } from 'next'
import { getProviders, getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'
import { modalState, showMenuState } from '../atoms/modalAtom'
import Login from '../components/Login'
import Sidebar from '../components/Sidebar'
import UserProfile from '../components/UserProfile'

const ProfilePage: NextPage<{
  providers: {}
}> = ({ providers }) => {
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const { data: session, status } = useSession()
  const router = useRouter()

  if (!session) return <Login providers={providers} />

  return (
    <>
      <Head>
        <title>Next Twitter</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main
        className="min-h-screen max-w-[1500px] bg-black"
        onClick={() => {
          setShowModal(false)
        }}
      >
        <Sidebar />
        <UserProfile user={session.user} ownProfile />
      </main>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const providers = await getProviders()
  const session = await getSession(ctx)
  return {
    props: {
      providers,
      session,
    },
  }
}

export default ProfilePage
