"use client";

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const session = useSession({

    // onUnauthenticated() {
    // router.push('/signin')
    // }
  })
  const [isSessionExist, setIsSessionExist] = useState(false);

  useEffect(() => {

    if (session && session.data && session.data.user && session.data.user.name) {

      setIsSessionExist(true);
    };
  }, [session])
  // useEffect(() => {
  //   if (isSessionExist) {
  //     router.push('/')
  //   }
  // }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const res = await signIn('credentials', {
      email,
      password,
      callbackUrl: "/",
      redirect: true
    }
    )


  }

  
  return (
    <div>

      <form onSubmit={handleSubmit} className=' flex justify-center items-center min-h-screen   '>
        <div className='border-2 rounded-lg flex flex-col w-1/2 lg:w-1/3 gap-7 p-10 py-10' >
<p className='text-center font-semibold text-3xl'>Admin Panel</p>
     

          <p className='text-center text-2xl font-semibold'>Login to TSSPDCL Admin Portal</p>

          
          <Input placeholder='Enter your email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder='Enter your Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />


          {/* <button type='submit'>Sign IN</button> */}
          <Button variant={'default'} size={'lg'} >Sign in as Admin</Button>
          <p className=' border-b-2'> </p>
          <p className='text-center '> OR</p>
          <Button variant={'outline'} size={'lg'} className='border border-black ' onClick={() =>window.location.href = "/signup"}>Create an Account</Button>
      
        </div>
      </form>

    </div>
  )
}