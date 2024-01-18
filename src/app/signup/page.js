"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
export default function Signup() {
    const router = useRouter();
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    // const session = useSession()
    // useEffect(() => {
    //     if (session?.data?.user?.name) {
    //         router.push('/')
    //     }
    // }, [session])
    const handleSubmit = async (e) => {
        e.preventDefault();
console.log("inside submit", userName, email, password, confirmPassword)
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, email, password, confirmPassword })
        })
        const response = await res.json()
        setMessage(response.message)
        console.log("response", response)

    }
    return (
        <div>
            <div className=' flex justify-center items-center min-h-screen my-10  '>

                <form onSubmit={handleSubmit} className='border-2 rounded-lg flex flex-col w-1/3 gap-7 p-10 py-10' >
                    <p className='text-center text-2xl font-semibold'>Create an Account</p>
                    <Input placeholder='Enter your Name' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <Input placeholder='Enter your email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder='Enter your Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input placeholder='Confirm your Password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <Button variant={'default'} size={'lg'}>Sign up</Button>
                    <p className=' border-b-2'> </p>
                    <p className='text-center '> OR</p>
                    <Button variant={'outline'} size={'lg'} className='border border-black' onClick={() => router.push("/signin")}>Sign in to your account</Button>
                </form>
            </div>


        </div>
    )
}