import { Bill } from "@/models/bill";
import { connectDB } from "@/middleware/mongoose";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
export async function POST(req, res) {
    const session = await getServerAuthSession();

    const { billId } = await req.json();

    await connectDB()
    const bill = await Bill.findOne({ _id: billId, billUser: session.user.id })
    if (!bill) {
        return NextResponse.json({ exists: false, confirmed: false })
    }
    if (bill.paymentConfirmationStatus === "PAID") {
        return NextResponse.json({ confirmed: true, bill: bill })
    }
    if (bill.paymentConfirmationStatus === "REJECTED") {
        return NextResponse.json({ bill: bill, rejected: true })
    }
    if (bill.paymentConfirmationStatus === "PENDING") {
        return NextResponse.json({ pending: true, bill: bill })
    }
    return NextResponse.json({ confirmed: false, bill: bill })
}