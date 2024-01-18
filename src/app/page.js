"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect } from 'react';
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
  // useEffect(()=>{

  // },[session])
  async function callApi() {
    const x = await fetch('/api/getbills')
    // const y = await x.json()
    const y = await x.json()
    console.log("res", y);
  }
  return (
    <main className='min-h-screen flex flex-col justify-center items-center' >


      <div className='flex justify-center items-center w-full' >

        {/* <span className='border   w-full mx-6'></span> <p className='text-center my-10'>OR</p> <span className=' border  w-full mx-6'></span> */}
      </div>


      <Form />

      {/* <Button onClick={callApi}>call api</Button> */}
    </main>
  )
}
