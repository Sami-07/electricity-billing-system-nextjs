import { Bill } from "@/models/bill";
import { connectDB } from "@/middleware/mongoose";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
export async function POST(req, res) {
    const {billId} = await req.json()
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.json({ exists: false })
    }
    await connectDB()
    const bill = await Bill.findOne({billUser:session.user.id, _id:billId})

    if (!bill) {
        return NextResponse.json({ exists: false })
    }

    return NextResponse.json({ exists: true, bill:bill })


}