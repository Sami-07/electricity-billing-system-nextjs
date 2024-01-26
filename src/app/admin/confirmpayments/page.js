"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSession } from 'next-auth/react'
export default function page() {
    const STATUS = ["PENDING", "PAID", "REJECTED"]
    const [bills, setBills] = useState([])
    const [status, setStatus] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const session = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = "/signin"
        },
    })
    useEffect(() => {
        async function getAllBills() {

            const res = await fetch('/api/getAllBills')
            const response = await res.json()
            console.log("admin response bills", response.bills)
            setBills(response.bills)

        }
        getAllBills()
    }, [])

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
    async function handleStatusChange(bill) {
        // clearout status after successful update
        console.log("bill", bill)
        console.log("status", status)
        const res = await fetch("/api/updateBill", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                billId: bill._id,
                status
            })
        })
        const data = await res.json()
        if (data.updated) {
            setStatus('')
            console.log("data", data)
            window.location.reload()
        }
    }



    return (
        <div>
    
            {isAdmin && <div className='min-h-screen flex flex-col  w-1/2 mx-auto mt-10 gap-4'>
            <p className='font-semibold text-3xl text-center'>ADMIN Panel</p>
            <p className='text-2xl text-center font-semibold'>Update Payment Status</p>
            <p className='text-center text-xl'>The payments for the following bills are initiated by Users. Update the status of the bills accordingly.</p>
                {bills && bills.map(bill => {
                    return (
                        <div className='grid grid-cols-2 gap-10 border border-black p-2 rounded-lg'>
                            <div className=''>

                                <p className='text-2xl '><span className='font-semibold'>USNo :</span> {bill.uniqueServiceNumber}</p>
                                <p className='text- '><span className='font-semibold'>Payment Status</span><br />
                                    <span className={`font-semibold ${bill.paymentConfirmationStatus == "PENDING" && "text-orange-500"} ${bill.paymentConfirmationStatus == "REJECTED" && "text-red-500"} ${bill.paymentConfirmationStatus == "PAID" && "text-green-500"}`}>{bill.paymentConfirmationStatus}
                                    </span></p>
                                <p className='text- '><span className='font-semibold'>Amount</span> ₹{bill.amount}.00</p>
                                <p className='font-semibold text-xl '><span className='font-semibold text-blue-600'>User</span> {bill.userName}</p>
                            </div>
                            <div className=' flex flex-col gap-2'>

                                <Select onValueChange={(selectedStatus) => {
                                    setStatus(selectedStatus)
                                }}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS.map(status => {
                                            return (
                                                <SelectItem key={status} value={status} >{status}</SelectItem>

                                            )
                                        })
                                        }

                                    </SelectContent>
                                </Select>
                                <Button onClick={() => handleStatusChange(bill)} className="bg-myprimary" variant={'default'} size={'lg'}>Update Payment Status </Button>

                            </div>
                        </div>
                    )
                })}

            </div>}
        </div>
    )
}
