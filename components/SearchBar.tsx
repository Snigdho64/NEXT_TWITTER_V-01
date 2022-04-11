import { SearchIcon } from '@heroicons/react/outline'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase.config'
import User from './User'

const SearchBar = () => {
  const [keyword, setKeyword] = useState('')
  const [isFocused, setisFocused] = useState(false)
  const [users, setUsers] = useState<any[] | null>()
  const { data: session } = useSession()
  useEffect(() => {
    const search = setTimeout(() => {
      if (!keyword.trim()) return setUsers(null)
      const key = keyword.trim().toLocaleLowerCase()
      getDocs(
        query(
          collection(db, 'users'),
          where('tag', '>=', key),
          where('tag', '<=', key + '\uf8ff'),
          //   where('uuid', '!=', session?.user.uuid)
          //   where('name', '<=', keyword + '\uf8ff')
        )
      ).then((docs) => {
        const data: any[] = []
        docs.forEach((doc) => {
          data.push({ ...doc.data() })
        })
        setUsers(data)
      })
    }, 1000)
    return () => clearTimeout(search)
  }, [keyword])

  return (
    <>
      <div className="relative flex w-full flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="fous:bg-opacity-10 min-w-[200px] flex-1 rounded-md bg-white bg-opacity-10 p-2 text-lg font-bold outline-none focus:border focus:border-sky-500 focus:bg-black focus:text-sky-500"
          placeholder="search for user..."
        />
        <SearchIcon className="absolute right-0 h-8 text-sky-500 hover:scale-105 hover:text-teal-500" />
        {users && users.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-10 flex min-w-max flex-col items-center justify-center space-y-2 rounded bg-black bg-opacity-50 p-2 backdrop-blur-lg sm:mx-auto sm:w-full">
            {users?.map((user) => (
              <User key={user.uuid} user={user} />
            ))}
          </div>
        )}
        {users?.length === 0 && (
          <div className="absolute top-full mt-10 flex w-full flex-col items-center justify-center space-y-2 rounded bg-white bg-opacity-10 p-2 backdrop-blur-sm">
            No users found.
          </div>
        )}
      </div>
    </>
  )
}

export default SearchBar
