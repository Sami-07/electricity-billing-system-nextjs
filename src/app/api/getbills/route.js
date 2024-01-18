import { Bill } from "@/models/bill";
import { connectDB } from "@/middleware/mongoose";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
export async function GET(req, res) {
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.json({ exists: false, bills: [] })
    }
    await connectDB()
    const bills = await Bill.find({ billUser: session.user.id })

    if (!bills) {
        return NextResponse.json({ exists: false, bills: [] })
    }

    return NextResponse.json({ exists: true, bills: bills })


}