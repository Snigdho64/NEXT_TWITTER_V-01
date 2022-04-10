import React from 'react'
import { LoginIcon } from '@heroicons/react/solid'
import {} from '@heroicons/react/outline'
import GoogleIcon from '../public/assets/GoogleIcon'
import GitIcon from '../public/assets/GitIcon'
import { signIn } from 'next-auth/react'
import TwitterIcon from '../public/assets/TwitterIcon'

const Login: React.FC<{
  providers: {
    [key: string]: any
  }
}> = ({ providers }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex min-h-[200px] flex-col items-center justify-around space-y-4  p-2">
        <div className="flex h-[160px] w-[180px]">
          <TwitterIcon className="shadow-white hover:scale-105 hover:shadow-lg" />
        </div>
        <h1 className="shadow:md text-xl font-bold text-white shadow-white">
          Login To Next Twitter
        </h1>
        {Object.keys(providers).map((key) => (
          <button
            className="flex items-center rounded-md bg-white bg-opacity-10 p-2 px-4 text-xl font-bold text-sky-500 transition-all duration-200 hover:scale-110 hover:bg-sky-500 hover:bg-opacity-10 hover:text-white"
            key={key}
            onClick={() => signIn(providers[key].id)}
          >
            {key === 'google' && (
              <GoogleIcon className="hoverAnimation h-12 w-12 p-1" />
            )}
            {key === 'github' && (
              <GitIcon className="hoverAnimation h-12 w-12 p-1" />
            )}
            <span>{providers[key].name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Login
