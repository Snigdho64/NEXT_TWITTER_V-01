import { doc, getDoc } from 'firebase/firestore'
import { NextPage, NextPageContext } from 'next'
import { getProviders, getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState, showMenuState } from '../../atoms/modalAtom'
import Loader from '../../components/Loader'
import Login from '../../components/Login'
import Sidebar from '../../components/Sidebar'
import UserProfile from '../../components/UserProfile'
import { db } from '../../firebase.config'

const ProfilePage: NextPage<{
  providers: {}
}> = ({ providers }) => {
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [user, setUser] = useState<any>()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)

  const {
    query: { uuid },
  } = useRouter()

  useEffect(() => {
    getDoc(doc(db, `users/${uuid}`)).then((doc) => {
      doc.exists() && setUser(doc.data())
    })
    setLoading(false)
  }, [db, uuid])

  if (!session) return <Login providers={providers} />

  
  return (
    <>
      <Head>
        <title>Next Twitter</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main
        className="min-h-screen max-w-[1500px] bg-black"
        onClick={() => setShowModal(false)}
      >
        <Sidebar />
        {loading || !user ? (
          <Loader message="Loading Profile..." />
        ) : (
          <UserProfile user={user} />
        )}{' '}
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
