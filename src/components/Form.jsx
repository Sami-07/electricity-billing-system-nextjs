import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
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
export default function Form() {
    const router = useRouter();
    const [uniqueServiceNumber, setuniqueServiceNumber] = useState('')
    const [amount, setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [credentials, setCredentials] = useState('')
    const [error, setError] = useState('')
    const [isClicked, setIsClicked] = useState(false)
    async function handlePayment() {

        if (uniqueServiceNumber.length < 10) {
            setError('Enter a valid 10 digit Unique Number')
            return
        }
        if (amount <= 0) {
            setError('Enter a valid Amount')
            return
        }
        if (paymentMethod === "Credit Card" && !(credentials.length >= 12)) {
            setError('Enter a valid 12 digit Credit Card Number')
            return
        }
        if (paymentMethod === "Debit Card" && !(credentials.length >= 12)) {
            setError('Enter a valid 12 digit Debit Card Number')
            return
        }
        if (paymentMethod === "UPI" && !(credentials.length >= 10)) {
            setError('Enter a  valid UPI ID with "@" included')
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
            uniqueServiceNumber,
            amount,
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
        console.log("data from api", data)
        if (data.status === 'success') {
            router.push(`/paymentstatus?billid=${data.billId}`)
        }
        if (data.status === 'Already Paid') {
            setError('You have already paid bill for this month for the same Unique Number.')
        }
        

    }
    return (
        <div className='w-96 flex flex-col justify-center items-center gap-10'>
            <p className='font-semibold text-xl'>Pay Your Electricity Bills</p>
            <Input placeholder='Enter Unique Service Number' type='text' value={uniqueServiceNumber}
                onChange={(e) => setuniqueServiceNumber(e.target.value)} />
            <Input placeholder='Enter Amount to be paid (in Rs.)' type='text' value={amount}
                onChange={(e) => setAmount(e.target.value)} />
            {uniqueServiceNumber.length >= 10 && amount > 0 && <Select onValueChange={(selectedMode) => {
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
            {paymentMethod === "Credit Card" && <Input placeholder='Enter Credit Card Number' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "Debit Card" && <Input placeholder='Enter Debit Card Number' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "UPI" && <Input placeholder='Enter UPI ID' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "Net Banking" && <Input placeholder='Enter Net Banking Number' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}

            {paymentMethod === "Wallet" && <Input placeholder='Enter Wallet ID' type='text' value={credentials}
                onChange={(e) => setCredentials(e.target.value)} />}




            {error && <p className='text-red-500 font-semibold'>{error}</p>}
            <Button className="bg-myprimary" onClick={handlePayment} variant={'default'} size={'lg'}>Proceed to pay</Button>

        </div>
    )
}
