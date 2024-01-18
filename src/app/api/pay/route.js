import { connectDB } from "@/middleware/mongoose";

import { User } from "@/models/user";
import { Bill } from "@/models/bill";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
export async function POST(req, res) {
    try {
        const billMonth = new Date().toLocaleString('default', { month: 'long' });
        const billYear = new Date().getFullYear();
        const session = await getServerAuthSession();
        if (!session) {
            return NextResponse.json({ status: "error" })
        }
        const { uniqueServiceNumber, amount, paymentMethod, credentials } = await req.json();

        console.log("session", session);
        await connectDB()
        const AlreadyPaid = await Bill.findOne({ uniqueServiceNumber: uniqueServiceNumber, billMonth: billMonth, billYear: billYear })
        if (AlreadyPaid) {
            return NextResponse.json({ status: "Already Paid" })
        }

        await Bill.create({
            uniqueServiceNumber,
            amount,
            billMonth,
            billYear,
            paymentMethod,
            credentials,
            billUser: session.user.id,
            paymentInitiated: true

        })
        const currentMonthBill = await Bill.findOne({ uniqueServiceNumber: uniqueServiceNumber, billMonth: billMonth, billYear: billYear })
        return NextResponse.json({ status: "success", billId: currentMonthBill._id })

    } catch (error) {
        return NextResponse.json({ status: error.message })
    }

}