"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
export default function page() {
  const [isAdmin, setIsAdmin] = useState(false)
  const session = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/signin"
    },
  })
  useEffect(() => {
    if (session && session.data && session.data.user && session.data.user.role) {
      if (session.data.user.role === "ADMIN") {
        setIsAdmin(true)
      }
      else {
        window.location.href = "/"
      }

      console.log(session)

    }
  }, [session])
  return (
    <div className='h-screen'>
      {isAdmin && <div>
        <p className='font-semibold text-3xl text-center my-10'>ADMIN Panel</p>
        <div className='flex gap-10  justify-center  '>
          <Link className='bg-myprimary hover:scale-110 transition-all text-white text-2xl h-40 rounded-lg cursor-pointer flex justify-center items-center w-80' href={"/admin/addBill"}>Add Bill</Link>
          <Link className='bg-myprimary hover:scale-110 transition-all text-white text-2xl h-40 rounded-lg cursor-pointer flex justify-center items-center w-80' href={"/admin/confirmpayments"}>Update Payment Status</Link>
        </div>
      </div>}
    </div>
  )
}
