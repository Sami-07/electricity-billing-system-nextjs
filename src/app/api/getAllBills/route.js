import { Bill } from "@/models/bill";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(req,res){
    const session = await getServerAuthSession();
    if(!session){
        return NextResponse.json({msg : "unauthenticated"})
    }
    if(session.user.role !== "ADMIN"){
        return NextResponse.json({msg : "unauthorized"})
    }
    const bills = await Bill.find({paymentInitiated : true})
    if(!bills){
        return NextResponse.json({msg : "no bills found"})
    }
    return NextResponse.json({msg : "success",bills : bills})
}