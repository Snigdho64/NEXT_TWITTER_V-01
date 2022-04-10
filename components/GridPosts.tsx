import { collection, getDocs } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase.config'
import Loader from './Loader'
import Post from './Post'

const GridPosts = () => {
  const [savePosts, setSavePosts] = useState<any[]>([])
  const [width, setWidth] = useState<number>()

  const { data: session } = useSession()
  useEffect(() => {
    const savedPostRef = collection(db, `users/${session?.user.uuid}/saves`)
    getDocs(savedPostRef).then((docs) => {
      setSavePosts(docs.docs)
    })
  }, [])

  useEffect(() => {
    setWidth(window.innerWidth)
    window.addEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return !width ? (
    <Loader message="Loading..." />
  ) : (
    <div className="relative flex min-h-[100vh] w-auto max-w-[100vw] flex-col items-center border-l border-l-gray-500 bg-white bg-opacity-10 text-white sm:ml-[57px] xl:ml-[322.115px]">
      <div className="my-10">
        <h1 className="text-2xl font-bold text-purple-500 underline ">
          Your Saved Posts
        </h1>
      </div>
      <div
        className={`
        ${width < 480 && 'grid-cols-1'}
        ${width > 480 && width < 800 && 'grid-cols-2'}
        ${width > 800 && width < 1200 && 'grid-cols-3'}
        ${width > 1200 && 'grid-cols-4'}
        grid w-full place-items-center gap-y-6 xl:grid-cols-3`}
      >
        {savePosts.map((post) => (
          <Post key={post.id} post={{ ...post.data(), id: post.id }} />
        ))}
      </div>
    </div>
  )
}

export default GridPosts
