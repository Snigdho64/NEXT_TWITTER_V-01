import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import type { GetServerSideProps, NextPage, NextPageContext } from 'next'
import { getProviders, getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState, showMenuState } from '../atoms/modalAtom'
import Feed from '../components/Feed'
import Login from '../components/Login'
import Sidebar from '../components/Sidebar'
import Widgets from '../components/Widgets'
import { db } from '../firebase.config'

const Home: NextPage<{
  trendingResults: [{}]
  followResults: [{}]
  providers: {}
}> = ({ trendingResults, followResults, providers }) => {
  const [toggleMenu, setToggleMenu] = useState(true)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const { data: session } = useSession()
  if (!session) return <Login providers={providers} />
  return (
    <>
      <Head>
        <title>Next Twitter</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main
        className="relative flex min-h-screen max-w-[1500px] bg-black"
        onClick={() => setShowModal(false)}
      >
        <Sidebar />
        <Feed />
        <div className="sticky top-0 -right-10 hidden h-[100vh] w-fit items-center justify-center lg:flex">
          <div className="flex w-full h-full items-center justify-center">
            <Widgets
              trendingResults={trendingResults}
              followResults={followResults}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const trendingResults = await fetch('https://jsonkeeper.com/b/NKEV').then(
    (res) => res.json()
  )
  const followResults = await fetch('https://jsonkeeper.com/b/WWMJ').then(
    (res) => res.json()
  )
  const providers = await getProviders()
  const session = await getSession(ctx)
  if (session) {
    const docSnap = await getDoc(doc(db, `users/${session.user.uuid}`))

    const existingUser = docSnap.data()

    if (!existingUser || Object.keys(existingUser).length === 0) {
      await setDoc(doc(db, `users/${session.user.uuid}`), {
        ...session.user,
        timestamp: serverTimestamp(),
      })
    }
  }
  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  }
}

export default Home
