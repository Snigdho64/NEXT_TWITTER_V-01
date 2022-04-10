import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase.config'

const User: React.FC<{
  user: {
    uuid: string
    name: string
    tag: string
    image: string
  }
}> = ({ user: { uuid, image, name, tag } }) => {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followsYou, setFollowsYou] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  //   FOLLOWING OF OWN
  const ownFollowingRef = collection(
    db,
    `users/${session?.user.uuid}/following`
  )
  // FOLLOWERS OF THE USER
  const followersRef = collection(db, `users/${uuid}/followers`)
  const followingRef = collection(db, `users/${uuid}/following`)

  //   CHECK IF YOUR OWN PROFILE
  const ownProfile = uuid === session?.user.uuid

  useEffect(() => {
    getDoc(doc(ownFollowingRef, uuid)).then((doc) => {
      setIsFollowing(doc.exists())
    })
  }, [ownFollowingRef, uuid])

  useEffect(() => {
    getDoc(doc(followingRef, session?.user.uuid)).then((doc) => {
      setFollowsYou(doc.exists())
    })
  }, [followingRef, uuid])

  const handleFollow = async () => {
    setLoading(true)
    if (isFollowing) {
      await deleteDoc(doc(ownFollowingRef, uuid))
      await deleteDoc(doc(followersRef, session?.user.uuid))
    } else {
      await setDoc(doc(ownFollowingRef, uuid), {
        name,
        tag,
        image,
        uuid,
      })
      await setDoc(doc(followersRef, session?.user.uuid), {
        name: session?.user.name,
        tag: session?.user.tag,
        image: session?.user.image,
        uuid: session?.user.uuid,
      })
    }
    setLoading(false)
  }

  return (
    <div
      className={`transitionAll group flex w-full items-center justify-between gap-2 rounded bg-opacity-30 px-2 py-1 ${
        ownProfile ? 'bg-emerald-500' : 'bg-teal-500'
      }`}
    >
      <div
        className="group flex min-w-fit cursor-pointer flex-col items-center gap-1 sm:flex-row"
        onClick={() => {
          if (ownProfile) {
            router.push('/my-profile')
          } else {
            router.push(`/user/${uuid}`)
          }
        }}
      >
        <img
          src={image}
          alt="user"
          className="w-12 rounded-full transition group-hover:scale-105"
        />
        <div className="md:text-normal flex flex-col items-center text-sm sm:text-base">
          <span>{name}</span>
          <span className="font-bold text-sky-500 transition group-hover:scale-105">
            @{tag}
          </span>
        </div>
      </div>
      {!ownProfile &&
        (followsYou ? (
          <div className="sm:text-normal flex rounded-md bg-gray-500 px-1 text-sm">
            <span>Follows You</span>
          </div>
        ) : (
          <div className="sm:text-normal flex rounded-md bg-gray-500 px-1 text-sm">
            <span> Not Following You</span>
          </div>
        ))}
      {ownProfile && (
        <div className="sm:text-normal flex rounded-md bg-green-500 px-1 text-sm">
          <span>Me</span>
        </div>
      )}
      {ownProfile ? (
        <div>
          <button
            className="text-md rounded bg-sky-500 px-1 hover:scale-105 hover:bg-emerald-500 sm:p-[0.5rem] sm:font-semibold"
            onClick={() => router.push('/my-profile')}
          >
            Go To Your Profile
          </button>
        </div>
      ) : (
        <div className="items center flex justify-between">
          <button
            className="text-md rounded bg-sky-500 px-1 hover:scale-105 hover:bg-emerald-500 sm:p-[0.5rem] sm:font-semibold"
            onClick={handleFollow}
          >
            {loading && 'wait...'}
            {!loading && isFollowing && 'Following'}
            {!loading && !isFollowing && 'Follow'}
          </button>
        </div>
      )}
    </div>
  )
}

export default User
