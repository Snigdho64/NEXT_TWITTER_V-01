import { SparklesIcon } from '@heroicons/react/outline'
import { BaseEmoji, Picker } from 'emoji-mart'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { emojiState, showMenuState } from '../atoms/modalAtom'
import { db } from '../firebase.config'
import Input from './Input'
import Loader from './Loader'
import Post from './Post'
import SearchBar from './SearchBar'

const Feed: React.FC = () => {
  const [showEmoji, setShowEmoji] = useRecoilState(emojiState)
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const [text, setText] = useState('')
  const [posts, setPosts] = useState<any[]>([])

  const selectEmoji = (e: BaseEmoji) => {
    setText((p: string) => p + e.native)
  }

  useEffect(
    //   Unsubscribe ? CLeanup function
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setPosts(snapshot.docs)
        }
      ),
    [db]
  )
  return (
    <div
      className="relative flex min-h-[100vh] w-[100vw] max-w-[100vw] flex-col border-l border-l-gray-500 bg-white bg-opacity-10 text-white sm:ml-[60px] xl:ml-[323px] xl:w-[52%]"
      onClick={() => {
        setShowMenu(false)
        setShowEmoji(false)
      }}
    >
      <div
        className={`sticky top-3 z-[30] my-4 flex w-[80%] items-center justify-center self-center p-0 sm:top-0 sm:mt-0 sm:ml-[0.3rem] sm:w-[100%] sm:bg-black sm:p-3 sm:px-6 ${
          showMenu && 'z-0'
        }`}
      >
        <SearchBar />
      </div>

      <Input
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
        text={text}
        setText={setText}
      />

      {showEmoji && (
        <div onClick={(e) => e.stopPropagation()}>
          <Picker
            theme="dark"
            onSelect={selectEmoji}
            set="apple"
            style={{
              position: 'absolute',
              zIndex: 20,
              left: `${window.innerWidth > 1024 ? '5rem' : '4.5rem'}`,
              top: `${
                window.innerHeight > 668 && window.innerWidth > 1024
                  ? '15rem'
                  : '13rem'
              }`,
              borderRadius: '16px',
              maxWidth: '320px',
            }}
          />
        </div>
      )}
      <div
        className="my-4 flex flex-col items-center space-y-2"
        onClick={() => setShowEmoji(false)}
      >
        {posts.map((post, idx) => (
          <Post key={idx} post={{ ...post.data(), id: post.id }} />
        ))}
      </div>
    </div>
  )
}

export default Feed
