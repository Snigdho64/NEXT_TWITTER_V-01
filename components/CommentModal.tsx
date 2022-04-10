import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
} from '@heroicons/react/outline'
import { PhotographIcon, XIcon } from '@heroicons/react/solid'
import { Picker, BaseEmoji } from 'emoji-mart'
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '../atoms/modalAtom'
import { db } from '../firebase.config'
import InfoModal from './InfoModal'
import Loader from './Loader'

const CommentModal: React.FC<{
  comments: DocumentData
}> = ({ comments }) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [postId, setPostId] = useRecoilState(postIdState)
  const { data: session } = useSession()
  const [showEmoji, setShowEmoji] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectEmoji = (e: BaseEmoji) => {
    setComment((p) => p + e.native)
  }

  const addComment = async () => {
    if (!comment.trim()) return
    setLoading(true)
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments')
      await setDoc(doc(commentsRef), {
        uuid: session?.user.uuid,
        username: session?.user.name,
        comment: comment,
        tag: session?.user.tag,
        avatar: session?.user.image,
        timestamp: serverTimestamp(),
      })
      setSuccess('Comment Added Successfully')
    } catch (e: any) {
      setError(e.message || 'Failed to add comment!')
    }
    setLoading(false)
  }

  return (
    <>
      <div
        className="absolute top-[5rem] bottom-[5rem] flex w-[90%] flex-col items-center space-y-1 rounded-lg bg-black bg-opacity-70 p-2 backdrop-blur-sm sm:space-y-2"
        onClick={() => {
          setShowEmoji(false)
        }}
      >
        <div className="absolute left-1 top-1 flex self-start">
          <XIcon
            className="postIcon h-8 w-8 hover:text-red-500"
            onClick={() => {
              setShowModal(false)
            }}
          />
        </div>
        <div className="flex w-full justify-between space-x-2">
          <div className="flex flex-col items-center space-x-2">
            <img
              src={session?.user.image}
              alt={session?.user.name}
              className="h-12 w-12 rounded-full"
            />
            <div className="sm:text:md flex cursor-pointer flex-col text-sm hover:scale-105 hover:text-sky-400 hover:underline xl:text-lg">
              <span className="">{session?.user.name || 'username'}</span>
              <span className="">@{session?.user.tag || 'tag'}</span>
            </div>
          </div>
          <div className="w-[75%]">
            <textarea
              value={comment}
              cols={30}
              rows={3}
              className="w-full rounded-lg bg-white bg-opacity-20 p-2 font-bold text-sky-500 outline-none focus:text-white"
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div
          className="flex w-full justify-between self-end"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center">
            <div className="icon">
              <PhotographIcon className="h-5 text-[#1d9bf0] sm:h-6 md:h-7 xl:h-8" />
            </div>
            <div className="icon rotate-90">
              <ChartBarIcon className="h-5 text-[#1d9bf0] sm:h-6 md:h-7 xl:h-8" />
            </div>
            <div
              className={`icon ${showEmoji && 'bg-teal-100 bg-opacity-10'}`}
              onClick={() => setShowEmoji((p: Boolean) => !p)}
            >
              <EmojiHappyIcon className="h-5 text-[#1d9bf0] sm:h-6 md:h-7 xl:h-8" />
            </div>
            <div className="icon">
              <CalendarIcon className="h-5 text-[#1d9bf0] sm:h-6 md:h-7 xl:h-8" />
            </div>
          </div>
          <button
            className="sm:text-md bg-sky-400 p-1 text-xs transition-all hover:scale-105 hover:bg-teal-400 active:bg-opacity-50 active:text-emerald-500"
            onClick={addComment}
          >
            Add Comment
          </button>
        </div>
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
                    ? '10rem'
                    : '9.5rem'
                }`,
                borderRadius: '16px',
                maxWidth: '320px',
              }}
            />
          </div>
        )}
        <div className="w-[95%] space-y-2 overflow-y-auto sm:max-h-[50%]">
          {comments.length > 0 ? (
            comments.map((comment: any) => (
              <div className="max-h-[4rem] w-full overflow-y-auto">
                <div className="flex items-center justify-between rounded-md bg-gray-500 bg-opacity-50 p-1">
                  <div className="group flex flex-col items-center space-x-2">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="h-8 w-8 rounded-full group-hover:scale-105"
                    />
                    <span className="xl:text-md sm:text-sms cursor-pointer text-xs hover:text-sky-400 hover:underline group-hover:scale-105">
                      @{comment.tag || 'tag'}
                    </span>
                  </div>
                  <div className="sm:text:md flex max-h-full w-[75%] justify-center overflow-x-auto break-words text-sm hover:text-sky-500 xl:text-base">
                    <span>{comment.comment}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className="mt-6 text-xl font-bold">No Comments Yet!</h1>
          )}
        </div>
        <div>{loading && <Loader message="Posting..." />}</div>
        {success && (
          <InfoModal message={success} setValue={setSuccess} type="Success" />
        )}
        {error && (
          <InfoModal setValue={setError} type="Error" message={error} />
        )}
      </div>
    </>
  )
}

export default CommentModal
