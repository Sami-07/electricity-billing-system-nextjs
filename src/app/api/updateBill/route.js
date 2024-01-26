import { Bill } from "@/models/bill";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const { billId, status } = await req.json();
    const session = await getServerAuthSession();
    if (!session) {
        return NextResponse.json({ msg: "unauthenticated" })
    }
    if (session.user.role !== "ADMIN") {
        return NextResponse.json({ msg: "unauthorized" })
    }
    const bill = await Bill.findOneAndUpdate({ _id: billId }, { paymentConfirmationStatus: status })
    if (!bill) {
        return NextResponse.json({ msg: "no bill found" })
    }
    return NextResponse.json({ msg: "updated", updated: true })
}

