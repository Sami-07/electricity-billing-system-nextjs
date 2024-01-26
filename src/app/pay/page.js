"use client"
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PAYMENT_OPTIONS } from '@/constants'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
export default function Form() {
    const searchParams = useSearchParams()

    const billId = searchParams.get('billid')
    const router = useRouter();
    const [uniqueServiceNumber, setuniqueServiceNumber] = useState('')
    const [amount, setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [credentials, setCredentials] = useState('')
    const [error, setError] = useState('')
    const [isClicked, setIsClicked] = useState(false)
    const [billData, setBillData] = useState(null)
    useEffect(() => {
        async function getBillDetails() {
            const res = await fetch("/api/getBillInfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ billId: billId }),
            })
            const data = await res.json()
            console.log("bill data", data)
            setBillData(data.bill)
        }
        getBillDetails()
    }, [])
    async function handlePayment() {

      
        if (paymentMethod === "Credit Card" && !(credentials.length >= 12)) {
            setError('Enter a valid 12 digit Credit Card Number')
            return
        }
        if (paymentMethod === "Debit Card" && !(credentials.length >= 12)) {
            setError('Enter a valid 12 digit Debit Card Number')
            return
        }
        if (paymentMethod === "UPI" && !(credentials.length >= 10)) {
            setError('Enter a  valid 10 digit UPI ID ')
            return
        }
        if (paymentMethod === "Net Banking" && !(credentials.length >= 10)) {
            setError('Enter a valid 10 digit Net Banking ID')
            return
        }
        if (paymentMethod === "Wallet" && !(credentials.length >= 10)) {
            setError('Enter a valid 10 digit Wallet ID')
            return
        }
        if (paymentMethod === '') {
            setError('Select a valid Payment Method')
            return
        }
        setError('')
        const details = {
           uniqueServiceNumber :  billData.uniqueServiceNumber,
            amount : billData.amount,
            paymentMethod,
            credentials
        }
        const res = await fetch("/api/pay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
        })
        const data = await res.json()

        if (data.status === 'success') {
            router.push(`/paymentstatus?billid=${data.billId}`)
        }
        if (data.status === 'Already Paid') {
            setError('You have already paid bill for this month for the same Unique Number.')
        }


    }
    return (
        <div className=' flex flex-col justify-center items-center gap-10 mt-10'>
            <p className='font-semibold text-xl'>Pay Via any payment Options</p>
            {
                billData && <div className='flex flex-col gap-5 justify-center items-center'>
                    <p className='font-semibold text-lg'>Bill Details</p>
                    <p><span className='font-semibold text-xl'>USNo : </span> {billData.uniqueServiceNumber}</p>
                    <p><span className='font-semibold text-xl'>Month/Year </span> {billData.billMonth} - {billData.billYear}</p>
                    <p><span className='font-semibold text-xl'>Amount </span> {billData.amount}</p>
                </div>
            }
            {<Select onValueChange={(selectedMode) => {
                setPaymentMethod(selectedMode)
            }}>
                <SelectTrigger className="w-96">
                    <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                    {PAYMENT_OPTIONS.map(option => {
                        return (
                            <SelectItem key={option} value={option} >{option}</SelectItem>

                        )
                    })
                    }

                </SelectContent>
            </Select>}
            {paymentMethod === "Credit Card" && <Input className="w-96" placeholder='Enter Credit Card Number' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "Debit Card" && <Input className="w-96" placeholder='Enter Debit Card Number' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "UPI" && <Input className="w-96" placeholder='Enter UPI ID' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "Net Banking" && <Input className="w-96" placeholder='Enter Net Banking Number' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "Wallet" && <Input className="w-96" placeholder='Enter Wallet ID' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}




            {error && <p className='text-red-500 font-semibold'>{error}</p>}
            <Button className="bg-myprimary" onClick={handlePayment} variant={'default'} size={'lg'}>Proceed to pay</Button>

        </div>
    )
}

