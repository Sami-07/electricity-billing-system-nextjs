import React from 'react'
import { FaChevronRight } from "react-icons/fa";
export default function ExistingBills() {
    return (
        <div>
            <p className='text-center text-xl font-semibold mb-5'>Pay your Pending Bills</p>


            <div className='flex justify-center items-center gap-4 md:text-2xl border border-black  rounded-lg mx-5 md:mx-0  px-5  text-base  py-2 '>
                <span>
                    ₹{120} due for USN No. <span className='font-semibold'> {123456789}</span>
                    {/*TODO: Show all bills where "paymentInitiated" field is false */}
                </span> <FaChevronRight />
            </div>

        </div>
    )
}
