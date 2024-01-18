import { Bill } from "@/models/bill";
import { connectDB } from "@/middleware/mongoose";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
export async function POST(req, res) {
    const session = await getServerAuthSession();

    const { billId } = await req.json();
    console.log("billid", billId);
    await connectDB()
    const bill = await Bill.findOne({ _id: billId, billUser: session.user.id })
    if (!bill) {
        return NextResponse.json({ exists: false, confirmed: false })
    }
    if (bill.paymentConfirmationStatus === "CONFIRMED") {
        return NextResponse.json({ confirmed: true, bill: bill })
    }
    return NextResponse.json({ confirmed: false, bill: bill })
}