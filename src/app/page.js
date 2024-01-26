"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Form from '@/components/Form';
import ExistingBills from '@/components/ExistingBills';
export default function Home() {
  const router = useRouter();

  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/signin')
    }
  })
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (session && session.data && session.data.user && session.data.user.role && session.data.user.role === "ADMIN") {
      setIsAdmin(true)
      console.log(session)
      router.push('/admin')
    }
  }, [session])


  return (
    <div>

      {!isAdmin && <main className=' flex flex-col h-screen justify-center items-center' >


        <div className='flex justify-center items-center flex-col' >
          {!isAdmin && <ExistingBills />}
          {!isAdmin && <div className='flex w-full justify-center items-center '>

            <span className='border-b border-black  w-full mx-6'></span> <p className='text-center my-10'>OR</p> <span className=' border-b border-black w-full mx-6'></span>
          </div>}
        </div>


        {!isAdmin && <Form />}

      </main>}
    </div>
  )
}
