import React, { useRef, useState } from 'react'
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from '@heroicons/react/outline'
import 'emoji-mart/css/emoji-mart.css'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { db, storage } from '../firebase.config'
import Loader from './Loader'
import InfoModal from './InfoModal'
import { useSession } from 'next-auth/react'

const Input: React.FC<{
  showEmoji: Boolean
  setShowEmoji: Function
  text: string
  setText: Function
}> = ({ showEmoji, setShowEmoji, text, setText }) => {
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const filePickerRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()

  const selectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function (this, prog) {
      // console.log((prog.loaded / prog.total) * 100)
      setBase64Image(this.result?.toString() || null)
    }
  }

  const createTweet = async () => {
    if (loading || !session) return
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        uuid: session.user.uuid,
        username: session.user.name,
        avatar: session.user.image,
        tag: session.user.tag,
        text: text,
        timestamp: serverTimestamp(),
      })

      const imageRef = ref(storage, `posts/${docRef.id}/image`)
      if (base64Image) {
        await uploadString(imageRef, base64Image, 'data_url').then(
          async (data) => {
            const downloadUrl = await getDownloadURL(imageRef)
            await updateDoc(doc(db, 'posts', docRef.id), {
              image: downloadUrl,
            })
          }
        )
      }
      setSuccess('Tweet Posted successfully!')
      setText('')
      setBase64Image(null)
      setShowEmoji(false)
    } catch (e: any) {
      setError(e?.message || 'There was an error uploading!')
    }
    setLoading(false)
  }

  return (
    <div
      className={`flex items-start space-x-3 overflow-y-auto border-b border-b-gray-700 p-3`}
      onClick={(e) => {
        setShowEmoji(false)
      }}
    >
      <img
        src={session?.user.image}
        className="h-10 w-10 cursor-pointer rounded-full xl:h-12 xl:w-12"
      />
      <div className="mx-auto flex w-full max-w-[80vw] flex-col items-center space-y-2 divide-y divide-gray-700">
        <div className="flex w-full flex-col items-center space-y-2">
          <textarea
            className="min-h-[12vh] w-full max-w-[680px] flex-1 rounded-lg bg-white bg-opacity-10 p-2 px-4 tracking-wider placeholder-gray-500 outline-none xl:min-h-[15vh]"
            value={text}
            placeholder="What's happening?"
            onChange={(e) => setText(e.target.value)}
            cols={30}
            rows={2}
          />
          {base64Image && (
            <div className="relative">
              <div className="absolute top-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#15181c] bg-opacity-75 hover:bg-[#272c26]">
                <XIcon
                  className="h-5 text-white"
                  onClick={() => setBase64Image(null)}
                />
              </div>

              <img
                src={base64Image}
                alt={''}
                className="max-h-80 rounded-lg object-contain"
              />
            </div>
          )}
        </div>
        <div className="flex w-full max-w-[650px] items-center justify-between pt-1">
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="icon"
              onClick={() => filePickerRef.current?.click()}
            >
              <PhotographIcon className="h-8 text-[#1d9bf0]" />
              <input
                type="file"
                hidden
                ref={filePickerRef}
                onChange={selectImage}
              />
            </div>
            <div className="icon rotate-90">
              <ChartBarIcon className="h-8 text-[#1d9bf0]" />
            </div>
            <div
              className={`icon ${showEmoji && 'bg-teal-100 bg-opacity-10'}`}
              onClick={() => setShowEmoji((p: Boolean) => !p)}
            >
              <EmojiHappyIcon className="h-8 text-[#1d9bf0]" />
            </div>
            <div className="icon">
              <CalendarIcon className="h-8 text-[#1d9bf0]" />
            </div>
          </div>
          <button
            className="text-md self-center rounded-3xl bg-[#1d9bf0] p-2 py-1 text-[#d9d9d9] shadow-md transition-all duration-200 hover:scale-105 hover:bg-sky-500 disabled:bg-gray-500"
            disabled={!text || !base64Image || loading}
            onClick={createTweet}
          >
            {loading ? 'Posting...' : 'Tweet'}
          </button>
        </div>
        {loading && <Loader message="Posting..." />}
        {error && (
          <InfoModal message={error} type="Error" setValue={setError} />
        )}
        {success && (
          <InfoModal message={success} type="Success" setValue={setSuccess} />
        )}
      </div>
    </div>
  )
}

export default Input
