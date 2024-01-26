"use client"
import React, { useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
export default function page() {

    const [users, setUsers] = useState([])
    const session = useSession({
        required: true,
        onUnauthenticated() {
          window.location.href = "/signin"
        },
      })
    const [uniqueServiceNumber, setuniqueServiceNumber] = useState('')
    const [amount, setAmount] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    const [message, setMessage] = useState('')
    useEffect(() => {
        async function getUsers() {
            console.log("inside getUsers")
            const res = await fetch('/api/getUsers')
            const response = await res.json()
            console.log("admin response", response.users)
            setUsers(response.users)

        }
        getUsers()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("inside handleSubmit", selectedUser, uniqueServiceNumber, amount)
        const res = await fetch("/api/addBill", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                selectedUser,
                uniqueServiceNumber,
                amount
            })
        })
        const data = await res.json()
        console.log("data", data)
        if (data.created) {
      setMessage("Bill Added Successfully")
            setuniqueServiceNumber('')
            setAmount('')
        } else {
            setMessage("Could not add Bill")
        }
    }
    return (
        <div className='h-screen flex mt-10 items-center flex-col'>
              <p className='font-semibold text-3xl text-center'>ADMIN Panel</p>
            <p className='text-center font-semibold text-2xl mt-10'>Add Bill to Users</p>
            <p className='mb-5'>Select a user from the dropdown and add a bill </p>

            {users && users.length > 0 && <Select onValueChange={(selectedUser) => {
                setSelectedUser(selectedUser)
            }}>
                <SelectTrigger className="w-96">
                    <SelectValue placeholder="Select a User" />
                </SelectTrigger>
                <SelectContent>
                    {users && users.length > 0 && users.map(user => {
                        return (
                            <SelectItem key={user.userName} value={user._id} >{user.userName}</SelectItem>

                        )
                    })
                    }

                </SelectContent>
            </Select>}


            {selectedUser && <form onSubmit={handleSubmit} className=' w-96 flex  flex-col gap-5 mt-5' >

                <Input placeholder='Enter Unique Service Number' type='text' value={uniqueServiceNumber} onChange={(e) => setuniqueServiceNumber(e.target.value)} />
                <Input placeholder='Enter amount' type='text' value={amount} onChange={(e) => setAmount(e.target.value)} />


                <Button variant={'default'} size={'lg'}>Add bill </Button>

            </form>}

            {message && <p>{message}</p>}
        </div>
    )
}
