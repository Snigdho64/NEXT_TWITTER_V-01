import React, { PropsWithChildren, ReactPropTypes } from 'react'

const Loader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed top-0 left-0 z-40 flex h-full w-full flex-col items-center justify-center self-center rounded-lg bg-black bg-opacity-50">
      <div className="h-[10vmax] w-[10vmax] animate-spin rounded-full border-b-4 border-b-sky-500"></div>
      {message && (
        <h2 className="text-white text-xl font-bold">{message}</h2>
      )}
    </div>
  )
}

export default Loader
