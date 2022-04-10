import Image from 'next/image'
import React, { useState } from 'react'
import SidebarLink from './SidebarLink'
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
  HomeIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClipboardListIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { showMenuState } from '../atoms/modalAtom'
import { useRouter } from 'next/router'

const Sidebar: React.FC = () => {
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const { data: session } = useSession()
  const { route, push } = useRouter()

  return (
    <div className="fixed z-20 m-auto h-full flex-col items-center justify-between space-y-4 border-r border-r-gray-700 bg-black bg-opacity-10 p-0 sm:flex sm:overflow-auto sm:p-2 sm:px-0 xl:pr-4">
      <div className="absolute left-0 top-0 z-10 flex w-[100vw] items-center justify-between gap-2 sm:static sm:w-auto sm:flex-col bg-black bg-opacity-80 backdrop-blur-lg">
        <div
          className="ml-2 flex max-w-[10vw] items-center justify-center rounded-full p-2
         hover:bg-teal-500 hover:bg-opacity-10 sm:m-0 xl:ml-24
        "
        >
          <Image
            src="/favicon.png"
            width={50}
            height={50}
            className="hover:scale-105"
            onClick={() => push('/')}
          />
        </div>
        <div
          className={`sm:my-2 flex w-auto items-center justify-evenly overflow-auto rounded-md bg-sky-500 bg-opacity-10 p-2 transition-all duration-300 ease-in-out sm:static sm:m-auto sm:block sm:translate-y-0 sm:space-y-2 sm:p-0 xl:ml-24 xl:p-2 ${
            showMenu ? 'translate-y-0' : '-translate-y-[100px]'
          }`}
        >
          <div className="flex w-full overflow-auto sm:flex-col">
            <SidebarLink
              text="Home"
              Icon={HomeIcon}
              active={route === '/'}
              onClick={() => push('/')}
            />
            <SidebarLink text="Explore" Icon={HashtagIcon} />
            <SidebarLink text="Notifications" Icon={BellIcon} />
            <SidebarLink text="Messages" Icon={InboxIcon} />
            <SidebarLink
              text="Bookmarks"
              Icon={BookmarkIcon}
              active={route === '/saved-posts'}
              onClick={() => push('/saved-posts')}
            />
            <SidebarLink text="Lists" Icon={ClipboardListIcon} />
            <SidebarLink
              text="Profile"
              Icon={UserIcon}
              active={route === '/my-profile'}
              onClick={() => push('/my-profile')}
            />
            <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
          </div>
        </div>
        <button
          className="mr-4 rounded-full bg-[#2aa9e0] bg-opacity-75 p-2 outline-none hover:scale-110 hover:bg-opacity-100 sm:hidden"
          onClick={() => {
            setShowMenu((p: Boolean) => !p)
          }}
        >
          {showMenu ? (
            <ArrowDownIcon className="h-7 text-white" />
          ) : (
            <ArrowUpIcon className="h-7 text-white" />
          )}
        </button>
      </div>
      <button className="ml-24 hidden w-[120px] self-center rounded-lg bg-[#1d9bf0] p-2 text-lg font-bold text-[#d9d9d9] shadow-md transition-all duration-200 hover:scale-105 hover:bg-sky-500 xl:block">
        Tweet
      </button>
      <div className="xl:rounded-4xl hidden cursor-pointer items-center gap-x-2 rounded-full bg-white bg-opacity-10 p-2 shadow-md hover:scale-105 hover:bg-sky-500 hover:bg-opacity-20 sm:flex xl:ml-24 xl:px-3">
        <Image
          src={session?.user?.image || '/assets/defaultAvatar.png'}
          width={40}
          height={40}
          className="rounded-full hover:scale-110"
        />
        <div className="hidden xl:inline">
          <h4 className=" text-white">{session?.user?.name}</h4>
          <p className=" cursor-pointer font-bold text-black hover:text-sky-400">
            {session?.user?.tag}
          </p>
        </div>
        <div className="hidden self-start rounded-md hover:bg-white hover:bg-opacity-10 xl:inline">
          <DotsHorizontalIcon className="h-7 text-white" />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
