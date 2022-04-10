import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import {
  HeartIcon as HeartSolid,
  ShareIcon,
  TrashIcon,
  SaveIcon as SaveSolid,
  DownloadIcon,
} from '@heroicons/react/solid'
import {
  ChatAlt2Icon,
  HeartIcon as HeartOutline,
  SaveIcon as SaveOutline,
  ChartBarIcon,
  DotsHorizontalIcon,
  CalendarIcon,
  EmojiHappyIcon,
  PhotographIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import {
  emojiState,
  modalState,
  postIdState,
  showMenuState,
} from '../atoms/modalAtom'
import { db } from '../firebase.config'
import formatDate from '../utils/fomatDate'
import { BaseEmoji, Picker } from 'emoji-mart'
import InfoModal from './InfoModal'
import Loader from './Loader'

const PostDetail: React.FC<{
  post: {
    image: string
    avatar: string
    username: string
    tag: string
    id: string
    uuid: string
    text: string
    timestamp: any
  }
}> = ({
  post: { avatar, id, image, tag, username, uuid, text, timestamp },
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)
  const [comments, setComments] = useState<any[]>([])
  const [likes, setLikes] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [showEmoji, setShowEmoji] = useRecoilState(emojiState)
  const { data: session } = useSession()
  const [comment, setComment] = useState('')

  const router = useRouter()

  const ownPost = uuid === session?.user.uuid

  useEffect(() => {
    const likesRef = collection(db, 'posts', id, 'likes')
    return onSnapshot(likesRef, (snapshot) => setLikes(snapshot.docs))
  }, [db, id])

  useEffect(() => {
    const commentsRef = collection(db, `posts/${id}/comments`)
    const q = query(commentsRef, orderBy('timestamp', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const data: any[] = []
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id })
      })
      setComments(data)
    })
  }, [db, id])

  useEffect(() => {
    const postSaveRef = collection(db, 'posts', id, 'saves')
    return onSnapshot(postSaveRef, (snapshot) => {
      setIsSaved(
        snapshot.docs?.findIndex((save) => save.id === session?.user.uuid) !==
          -1
      )
    })
  }, [db, id])

  useEffect(() => {
    setIsLiked(
      likes?.findIndex((like) => like.id === session?.user.uuid) !== -1
    )
  }, [likes])

  const handleLike = async () => {
    const likesRef = collection(db, 'posts', id, 'likes')
    if (isLiked) {
      await deleteDoc(doc(likesRef, session?.user.uuid))
    } else {
      await setDoc(doc(likesRef, session?.user.uuid), {
        username: session?.user.name,
      })
    }
  }

  const handleSave = async () => {
    const postSaveRef = collection(db, 'posts', id, 'saves')
    const userSaveRef = collection(db, `users/${session?.user.uuid}/saves`)
    if (isSaved) {
      await deleteDoc(doc(postSaveRef, session?.user.uuid))
      await deleteDoc(doc(userSaveRef, id))
    } else {
      await setDoc(doc(postSaveRef, session?.user.uuid), {
        username: session?.user.name,
      })
      await setDoc(doc(userSaveRef, id), {
        image,
        avatar,
        username,
        tag,
        text,
        uuid,
      })
    }
  }

  const deletePost = async () => {
    setLoading(true)
    await deleteDoc(doc(db, 'posts', id))
      .then(() => setSuccess('Post deleted successfully!'))
      .catch((e) => setError(e.message || 'Post Deletion Failed'))
  }

  const selectEmoji = (e: BaseEmoji) => {
    setComment((p) => p + e.native)
  }

  const addComment = async () => {
    if (!comment.trim()) return
    setLoading(true)
    try {
      const commentsRef = collection(db, 'posts', id, 'comments')
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
    <div
      className=" flex min-h-[100vh] w-auto flex-col items-center justify-between border-l border-l-gray-500 bg-white bg-opacity-10 text-white sm:ml-[60px] xl:ml-[321px]"
      onClick={() => {
        setShowMenu(false)
        setShowEmoji(false)
      }}
    >
      <div className="flex w-full flex-col items-center justify-between space-y-4 p-4 md:flex-row md:space-y-0">
        <div className="flex flex-col gap-2 rounded-lg border border-gray-500 p-4 md:w-[60%]">
          <div className="flex items-center justify-between p-2">
            <div
              className="group flex cursor-pointer items-center gap-2"
              onClick={() =>
                ownPost
                  ? router.push('/my-profile')
                  : router.push(`/user/${uuid}`)
              }
            >
              <Image
                src={avatar}
                width={60}
                height={60}
                className="rounded-full group-hover:scale-105"
              />
              <div className="group flex flex-col items-center">
                <span>{username}</span>
                <span className="hover:text-sky-500 group-hover:scale-105 group-hover:font-bold">
                  @{tag}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <DotsHorizontalIcon className="postIcon self-end" />
              <span>{timestamp && formatDate(timestamp.toDate())}</span>
            </div>
          </div>
          <div className="p-1">{text}</div>
          <Image src={image} alt="post" width={600} height={600} />
          <div className="flex w-full flex-wrap items-center justify-between">
            <div className="flex w-[33.33%] items-center justify-center">
              {isLiked ? (
                <HeartSolid
                  className="postIcon text-red-500"
                  onClick={handleLike}
                />
              ) : (
                <HeartOutline
                  className="postIcon text-red-500"
                  onClick={handleLike}
                />
              )}
              <span className="text-md p-1 font-bold">{likes.length || 0}</span>
            </div>
            <div className="flex w-[33.33%] items-center justify-center">
              <ChatAlt2Icon className="postIcon text-teal-500" />

              <span className="text-md p-1 font-bold">
                {comments.length || 0}
              </span>
            </div>
            <a
              className="flex w-[33.33%] items-center justify-center"
              href={`${image}/dl=`}
              download
              target="_blank"
            >
              <DownloadIcon className="postIcon text-zinc-500 hover:text-emerald-500" />
            </a>
            <div className="flex w-[33.33%] items-center justify-center">
              {isSaved ? (
                <SaveSolid
                  className="postIcon text-amber-500"
                  onClick={handleSave}
                />
              ) : (
                <SaveOutline
                  className="postIcon text-amber-500"
                  onClick={handleSave}
                />
              )}
            </div>
            <div className="flex w-[33.33%] items-center justify-center">
              <ShareIcon className="postIcon text-zinc-500" />
              <span className="p-1 text-lg">0</span>
            </div>
            {ownPost && (
              <div className="flex w-[33.33%] items-center justify-center">
                <TrashIcon
                  className="postIcon text-zinc-500 hover:text-red-500"
                  onClick={deletePost}
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative flex h-full flex-col items-center justify-between gap-2 md:w-[40%]">
          <div className="flex w-full items-center justify-between space-x-2">
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
            <div className="relative flex items-center">
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
                          ? '2.5rem'
                          : '2.5rem'
                      }`,
                      borderRadius: '16px',
                      maxWidth: '320px',
                    }}
                  />
                </div>
              )}
            </div>
            <button
              className="sm:text-md bg-sky-400 p-1 text-xs transition-all hover:scale-105 hover:bg-teal-400 active:bg-opacity-50 active:text-emerald-500"
              onClick={addComment}
            >
              Add Comment
            </button>
          </div>
          <div className="flex w-[95%] flex-col items-center justify-center space-y-2 overflow-y-auto py-2 xl:mt-10">
            {comments.length > 0 ? (
              comments.map((comment: any) => (
                <div key={comment.id} className="w-full">
                  <div className="flex max-h-[8rem] w-full items-center justify-between gap-2 overflow-y-auto rounded-md bg-gray-500 bg-opacity-50 p-1">
                    <div className="group flex flex-col items-center space-x-2">
                      <img
                        src={comment.avatar}
                        alt={comment.username}
                        className="h-8 w-8 rounded-full group-hover:scale-105"
                      />
                      <span className="cursor-pointer text-sm hover:text-sky-400 hover:underline group-hover:scale-105 md:text-base">
                        @{comment.tag || 'tag'}
                      </span>
                    </div>
                    <div className="sm:text:base break-word flex max-h-[100px] w-[75%] justify-center overflow-x-auto rounded bg-white bg-opacity-10 p-2 text-base text-sky-500 xl:rounded-lg xl:text-lg">
                      <span>{comment.comment}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="mt-6 text-xl font-bold">No Comments Yet!</h1>
            )}
          </div>
          <div className="absolute top-20">
            {loading && <Loader message="Posting..." />}
            {success && (
              <InfoModal
                message={success}
                setValue={setSuccess}
                type="Success"
              />
            )}
            {error && (
              <InfoModal setValue={setError} type="Error" message={error} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
