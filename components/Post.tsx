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
} from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import formatDate from '../utils/fomatDate'
import { useRecoilState } from 'recoil'
import { emojiState, modalState, postIdState } from '../atoms/modalAtom'
import { useSession } from 'next-auth/react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import InfoModal from './InfoModal'
import CommentModal from './CommentModal'
import { useRouter } from 'next/router'
import Loader from './Loader'

const Post: React.FC<{
  post: {
    id: string
    uuid: string
    text: string
    image: string
    username: string
    avatar: string
    tag: string
    timestamp: any
  }
  postPage?: any
}> = ({
  post: { image, avatar, username, tag, text, timestamp, id, uuid },
}) => {
  const [isLiked, setIsLiked] = useState(false)

  const [comments, setComments] = useState<any[]>([])
  const [likes, setLikes] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [postId, setPostId] = useRecoilState(postIdState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [showEmoji, setEmoji] = useRecoilState(emojiState)
  const { data: session } = useSession()

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

  const router = useRouter()

  const ownPost = uuid === session?.user.uuid

  if (loading) return <Loader message="loading" />

  return (
    <>
      <div
        className="relative flex w-[80%] max-w-[600px] flex-col items-center space-y-2 rounded-xl border border-gray-500 bg-sky-200 bg-opacity-10 p-2 hover:shadow-md hover:shadow-gray-500"
        onClick={(e) => {
          setEmoji(false)
          e.stopPropagation()
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div
            className="flex space-x-2"
            onClick={() => {
              if (ownPost) {
                router.push('/my-profile')
              } else {
                router.push(`user/${uuid}`)
              }
            }}
          >
            <img
              src={avatar || '/assets/defaultAvatar.png'}
              alt={username}
              className="h-8 w-8 rounded-full object-cover object-center"
            />
            <div className="flex cursor-pointer flex-col hover:scale-105 hover:text-sky-400 hover:underline">
              <span className="">{username || 'username'}</span>
              <span className="">@{tag || 'tag'}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <DotsHorizontalIcon className="postIcon self-end" />
            <span>{timestamp && formatDate(timestamp.toDate())}</span>
          </div>
        </div>
        <div className="flex w-[90%] flex-wrap text-lg font-bold">
          <h1 className="text-left">{text}</h1>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={image}
            alt="post"
            className="max-h-[500px] w-[90%] cursor-pointer rounded-lg object-cover object-center transition hover:scale-105  hover:shadow-md sm:w-[80%] xl:w-fit"
            onClick={() => router.push(`/post/${id}`)}
          />
        </div>
        <div className="flex w-[90%] flex-wrap items-center justify-between">
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
            <ChatAlt2Icon
              className="postIcon text-teal-500"
              onClick={() => {
                setShowModal((p) => (postId === id ? !p : true))
                setPostId(id)
              }}
            />

            <span className="text-md p-1 font-bold">
              {comments.length || 0}
            </span>
            {showModal && postId === id && <CommentModal comments={comments} />}
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
      {(success || error) && (
        <div className="fixed top-0 z-30 flex h-full w-full items-start justify-center bg-black bg-opacity-40">
          {success && (
            <InfoModal message={success} type="Success" setValue={setSuccess} />
          )}
          {error && (
            <InfoModal message={error} type="Error" setValue={setError} />
          )}
        </div>
      )}
    </>
  )
}

export default Post
