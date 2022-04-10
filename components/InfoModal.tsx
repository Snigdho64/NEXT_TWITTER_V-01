import React, { useState } from 'react'
import { CheckIcon, StopIcon, MailIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'

const InfoModal: React.FC<{
  message?: string | null
  type: 'Error' | 'Info' | 'Success'
  setValue?: React.Dispatch<React.SetStateAction<string | any>>
}> = ({ message, type = 'Info', setValue }) => {
  const [show, setShow] = useState(true)
  const messageStyles = `hover:text-white ${
    type === 'Error' ? 'text-red-500' : 'text-emerald-500'
  }`

  const modalStyles = ` hover:bg-white hover:bg-opacity-10 ${
    type === 'Error' ? 'bg-red-500' : 'bg-emerald-500'
  }`

  return show ? (
    <div
      className={`flex h-fit w-fit flex-col items-center justify-center self-center
        rounded-lg bg-opacity-10 py-2 px-4 transition-all duration-300 hover:scale-105 ${modalStyles}`}
    >
      <div className="flex items-center justify-around space-x-4">
        {type === 'Info' && <MailIcon color="white" width={25} height={25} />}
        {type === 'Error' && <StopIcon color="red" width={25} height={25} />}
        {type === 'Success' && (
          <CheckIcon color="green" width={25} height={25} />
        )}
        <h1 className={`text-bold max-w-[400px] break-words ${messageStyles}`}>
          {message?.trim() || type}
        </h1>
        <XIcon
          color={`${type === 'Error' ? 'red' : 'green'}`}
          className="postIcon relative -right-3 -mt-1 h-8 w-8 self-start"
          onClick={() => {
            setShow(false)
            setValue && setValue('')
          }}
        />
      </div>
    </div>
  ) : null
}

export default InfoModal
