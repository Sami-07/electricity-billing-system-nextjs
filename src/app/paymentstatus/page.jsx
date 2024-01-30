"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RiVerifiedBadgeFill } from "react-icons/ri";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export default function PaymentStatus() {

    const params = useSearchParams()
    const billId = params.get('billid')
    const [bill, setBill] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isRejected, setIsRejected] = useState(false)
    const [isPending, setIsPending] = useState(false)
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

            if (data.confirmed) {
                setIsConfirmed(true)

            }
            if (data.rejected) {
                setIsRejected(true)
            }
            if (data.pending) {
                setIsPending(true)
            }
            if (data.bill) {
                setBill(data.bill)
            }
            setIsLoading(false)
        }
        getPaymentConfirmationStatus()
    }, [])

    const generatePDF = () => {
        const element = document.getElementById('pdf-container');

        if (!element) {
            console.error('Element with ID "pdf-container" not found.');
            return;
        }

        html2canvas(element)
            .then((canvas) => {
                const pdfWidth = 210; // A4 page width in mm
                const pdfHeight = 297; // A4 page height in mm

                const contentWidth = canvas.width;
                const contentHeight = canvas.height;

                // Calculate the scale factor to fit content on A4 page
                const scaleFactor = Math.min(pdfWidth / contentWidth, pdfHeight / contentHeight);

                // Create jsPDF instance with adjusted dimensions
                const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

                // Add title to the PDF
                const title = 'Payment Details';
                const titleX = pdfWidth / 2; // Centered horizontally
                const titleY = 10; // Position from the top

                pdf.setFontSize(16);
                pdf.text(title, titleX, titleY, { align: 'center' });

                // Add content to the PDF, centered
                const contentX = (pdfWidth - (contentWidth * scaleFactor)) / 2;
                const contentY = titleY + 10; // Add some spacing between title and content

                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', contentX, contentY, contentWidth * scaleFactor, contentHeight * scaleFactor);
                pdf.save('payment_details.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };


    return (
        <>
            {isLoading && <div className='flex flex-col justify-center items-center min-h-screen'>
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className='text-3xl'>Loading...</p>
            </div>
            }

            {!isLoading && <div className='flex flex-col justify-center'>

                {isPending && <div className='text-xl w-1/2 mx-auto text-center my-10  '>
                    <RiVerifiedBadgeFill className='text-9xl mx-auto text-green-500 my-5' />Your Payment has been initiated Successfully!
                    Please wait till the admin confirms the payment details.
                    After verifying the payment info, your payment confirmation will be updated in your profile. </div>}
                {isConfirmed && <p className='text-3xl text-center my-10 text-green-500 font-semibold'> <RiVerifiedBadgeFill className='text-9xl mx-auto text-green-500 my-5' />Your Payment has been confirmed Successfully!</p>}
                {isRejected && <p className='text-3xl text-center my-10 text-red-500 font-semibold'>Your Payment has been rejected! The amount will be refunded if deducted. Please try paying again.</p>}


                {bill && (


                    <div id="pdf-container" class="container mx-auto my-8">
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

                <div className='flex justify-center mb-4'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={generatePDF}
                    >
                        Generate PDF
                    </button>
                </div>
            </div>
            }

        </>
    )
}
