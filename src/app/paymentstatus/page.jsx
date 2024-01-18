"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function PaymentStatus() {

    const params = useSearchParams()
    const billId = params.get('billid')
    const [bill, setBill] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        async function getPaymentConfirmationStatus() {
            setIsLoading(true)
            const res = await fetch(`/api/paymentconfirmationstatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ billId }),
            })
            const data = await res.json()
            console.log("data from api", data)
            if (data.confirmed) {
                setIsConfirmed(true)

            }
            if (data.bill) {
                setBill(data.bill)
            }
            setIsLoading(false)
        }
        getPaymentConfirmationStatus()
    }, [])
    return (
        <>
            {isLoading && <div className='flex flex-col justify-center items-center min-h-screen'>
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className='text-3xl'>Loading...</p>
            </div>
            }

            {!isLoading && <div className='flex flex-col justify-center'>

                {(!isLoading && !isConfirmed) && <div className='text-xl w-1/2 mx-auto text-center my-10  '>
                    <RiVerifiedBadgeFill className='text-9xl mx-auto text-green-500 my-5' />Your Payment has been initiated Successfully!
                    Please wait till the admin confirms the payment details.
                    After verifying the payment info, your payment confirmation will be updated in your profile. </div>}
                {isConfirmed && <p className='text-3xl text-center my-10 text-green-500 font-semibold'>Your Payment has been confirmed Successfully!</p>}


                {bill && (


                    <div class="container mx-auto my-8">
                        <table class=" w-1/2 mx-auto bg-white border-2    border-gray-300">
                            <tbody className=''>

                                <tr>
                                    <td class="py-1 px-2 text-lg">Unique Service Number</td>
                                    <td class="py-1 px-2 text-lg">{bill.uniqueServiceNumber}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2 text-lg">Amount</td>
                                    <td class="py-1 px-2 text-lg">₹ {bill.amount}.00</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2 text-lg">Month/Year</td>
                                    <td class="py-1 px-2 text-lg">{bill.billMonth} - {bill.billYear}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2 text-lg">Payment Confirmation Status</td>
                                    <td className={`py-1 px-2 text-lg font-semibold ${bill.paymentConfirmationStatus == "PENDING" && "text-orange-500"} ${bill.paymentConfirmationStatus == "REJECTED" && "text-red-500"} ${bill.paymentConfirmationStatus == "PAID" && "text-green-500"}`}>{bill.paymentConfirmationStatus}</td>
                                </tr>






                                <tr>
                                    <td class="py-1 px-2 text-lg">Payment Mode</td>
                                    <td class="py-1 px-2 text-lg">{bill.paymentMethod}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}



            </div>}
        </>
    )
}
