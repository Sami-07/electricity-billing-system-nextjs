"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link';



export default function Navbar() {
    const [name, setName] = useState("");
    const router = useRouter();
    const session = useSession();
const [isAdmin, setIsAdmin] = useState(false)
    const [isSessionExist, setIsSessionExist] = useState(false);
    useEffect(() => {

        if (session && session.data && session.data.user && session.data.user.name) {
            setName(session.data.user.name)
            setIsSessionExist(true);
            if(session.data.user.role === "ADMIN"){
                setIsAdmin(true)
            }
        };
    }, [session])
    return (

        <nav className='bg-myprimary h-14 flex justify-between px-2 md:px-10 items-center sticky top-0'>
            <div onClick={() => router.push("/")} className='font-semibold flex items-center gap-2 md:text-2xl text-white cursor-pointer'>
                <Avatar >
                    <AvatarImage src="https://play-lh.googleusercontent.com/hoPKX1ssHpABxLBsbRhpdTKfNIQDT8sVprvnXANp3d3kQZr7MyN_3cexZ_1zW0zX4GOZ" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>  <span className='md:text-xl'>TSSPDCL</span></div>
            <div className='flex gap-4 items-center capitalize'>

           
                {isSessionExist && <div onClick={() => router.push("/profile")} className='flex items-center gap-2 cursor-pointer'>

                    {/* <Avatar >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar> */}


                    <p className={`text-xs md:text-xl py-1  ${isAdmin ? "bg-yellow-400 text-black" : "bg-purple-500 text-white"} p-2 rounded-xl`}>{name}</p>
                </div>}
                {isSessionExist ? <Button className='flex items-center  gap-2 border-2 border-white text-white' variant={'ghost'} onClick={() => signOut()}>
                    <span className='hidden md:block'>Logout </span>
                    <FaArrowRightToBracket />
                </Button> : <Button className='flex items-center  gap-2 border-2 border-white text-white' variant={'ghost'} onClick={() => router.push("/signin")} >
                    <span className='hidden md:block'>Login </span>
                    <FaArrowRightToBracket />
                </Button>}
                {/* <Button className='flex items-center bg-purple-600  gap-2 border-2 border-white text-white' variant={'ghost'} onClick={() => router.push("/admin")} >
                    <span className='hidden md:block'>Admin Panel </span>
                    <FaArrowRightToBracket />
                </Button> */}
            </div>
        </nav>

    )
}