import { LogoutIcon } from '@heroicons/react/solid'
import { collection, getDocs } from 'firebase/firestore'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { showMenuState } from '../atoms/modalAtom'
import { db } from '../firebase.config'
import User from './User'

const UserProfile: React.FC<{
  user: {
    name: any
    image: any
    uuid: any
    tag: any
  }
  ownProfile?: any
}> = ({ user: { name, tag, image, uuid }, ownProfile }) => {
  const [activeBtn, setActiveBtn] = useState<
    'Followers' | 'Following' | string
  >('Following')
  const [activeList, setActiveList] = useState<any[]>([])
  const [followedByYou, setFollowedByYou] = useState(false)
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const { data: session } = useSession()

  useEffect(() => {
    const temp: any = []
    if (activeBtn === 'Following') {
      getDocs(collection(db, `users/${uuid}/following`)).then((data) => {
        data.docs.forEach((doc) => {
          if (doc.data().uuid === session?.user.uuid) setFollowedByYou(true)
          temp.push({ id: doc.id, ...doc.data() })
        })
        setActiveList(temp)
      })
    } else {
      getDocs(collection(db, `users/${uuid}/followers`)).then((data) => {
        data.docs.forEach((doc) => {
          temp.push({ id: doc.id, ...doc.data() })
        })
        setActiveList(temp)
      })
    }
  }, [activeBtn])
  
  return (
    <div
      className="relative flex min-h-[100vh] w-auto max-w-[100vw] flex-col border-l border-l-gray-500 bg-white bg-opacity-10 text-white sm:ml-[60px] xl:ml-[321px]"
      onClick={() => {
        setShowMenu(false)
      }}
    >
      <div className="group relative flex flex-col items-center">
        <div className="transitionAll rounded-lg bg-red-500 bg-opacity-10 p-2 group-hover:p-0">
          <Image
            src={
              'https://source.unsplash.com/random/1000x500?innovation,creativity,space,technology,design'
            }
            width={800}
            height={350}
            className="transitionAll max-h-[300px] rounded-lg group-hover:scale-110"
          />
        </div>
        <div className="items center transitionAll group absolute top-[70%] flex cursor-pointer flex-col rounded-lg bg-white bg-opacity-10 p-4 group-hover:bg-sky-500 group-hover:bg-opacity-10 sm:top-[75%] sm:py-2">
          <img
            src={image}
            alt={name}
            className="max-h-[100px] w-auto rounded-full group-hover:scale-105 sm:max-h-[140px]"
          />
          <span>{name}</span>
          <span className="text-sky-500 group-hover:scale-105 group-hover:text-teal-500">
            @{tag}
          </span>
        </div>
        {ownProfile && (
          <button
            className="transitionAll hover:bg-opacity group absolute -bottom-[5rem] right-2 flex h-auto w-20 min-w-[20vmin] cursor-pointer items-center justify-center self-end rounded-full p-2 text-white hover:bg-sky-500 hover:text-white"
            onClick={() => {
              signOut()
            }}
          >
            <span className="text-md p-1 font-bold">Logout</span>
            <LogoutIcon className="max-w-10 max-h-10" />
          </button>
        )}
        {!ownProfile && (
          <button
            className={`mt-2 self-end rounded-lg border-b-2 border-b-sky-500 bg-sky-500 bg-opacity-10 p-1 px-2 text-lg font-bold
            text-sky-500`}
          >
            {followedByYou ? 'Followed By You' : 'You are not following'}
          </button>
        )}
      </div>
      <div className="items center mt-[20vh] flex min-h-[400px] flex-col space-y-2 rounded-lg border p-4 sm:mt-[28vh]">
        <div className="m-2 flex items-center justify-around">
          {['Followers', 'Following'].map((item, idx) => (
            <button
              key={idx}
              className={`rounded-lg bg-sky-500 bg-opacity-10 p-1 px-2 text-lg font-bold ${
                activeBtn === item && 'border-b-2 border-b-sky-500 text-sky-500'
              }`}
              onClick={() => {
                setActiveBtn(item)
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex w-full items-center justify-center">
          {activeList && activeList.length > 0 && (
            <div className="flex min-w-max flex-col items-center w-full justify-center space-y-2 rounded bg-white bg-opacity-10 p-2 backdrop-blur-sm sm:mx-auto sm:w-full">
              {activeList?.map((user) => (
                <User key={user.uuid} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
