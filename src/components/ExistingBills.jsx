"use client"
import { useState, useEffect } from 'react'
import { FaChevronRight } from "react-icons/fa";
import { useRouter } from 'next/navigation'
export default function Profile() {
    const router = useRouter();
    const [bills, setBills] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function getAllBills() {
            setIsLoading(true)
            const res = await fetch(`/api/getPendingBills`)
            const data = await res.json()


            if (data.bills) {
                setBills(data.bills)
            }
            setIsLoading(false)

        }
        getAllBills()
    }, [])
    return (
        <div className=' mx-auto flex flex-col justify-center items-center'>

            <p className='font-semibold text-3xl mb-5'>Your Pending Bills</p>
            {bills && bills.length === 0 && <p className='font-semibold text-purple-500 text-xl mb-5'>No Pending Bills</p>}
            {bills && bills.length > 0 && bills.map(bill => {
                return (
                    <div key={bill.id} className=' flex gap-10  my-2 mx-auto justify-center items-center  md:text-xl border border-black  rounded-lg  md:mx-0  px-5  text-base  py-2 '>
                        <div>

                            <p><span className='font-semibold'>USNo : </span> {bill.uniqueServiceNumber}</p>
                            <p><span className='font-semibold'>Payment Status : </span> <span className={`font-semibold ${bill.paymentConfirmationStatus === "REJECTED"  && "text-red-500"}  ${bill.paymentConfirmationStatus === "PENDING"  && "text-orange-500"} ${bill.paymentConfirmationStatus === "PAID"  && "text-green-500"}`}>{bill.paymentConfirmationStatus}</span></p>
                            <p><span className='font-semibold'>Month/Year </span> {bill.billMonth} - {bill.billYear}</p>
                        </div>
                        <div onClick={() => router.push(`/pay?billid=${bill._id}`)} className='flex justify-center items-center gap-2 border-2 p-2 rounded-xl bg-myprimary text-white px-2 text-sm cursor-pointer'>
                            Pay Now
                            <FaChevronRight />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
