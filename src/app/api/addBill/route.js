
import { connectDB } from "@/middleware/mongoose";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { Bill } from "@/models/bill";
import { User } from "@/models/user";
export async function POST(req,res){
const session = await getServerAuthSession()
if(!session){
    return NextResponse.json({message:"not authenticated"})
}
if(session.user.role !== "ADMIN"){
    return NextResponse.json({message:"unauthorized access"})
}
connectDB()
const {selectedUser,uniqueServiceNumber,amount} = await req.json()
try {
    const month = new Date().toLocaleString('default', { month: 'long' })
    const  year = new Date().getFullYear()
    const user = await User.findById(selectedUser)
    const createBill = await Bill.create({
        uniqueServiceNumber : uniqueServiceNumber,
        amount : amount,
        billUser : selectedUser,
        billMonth : month,
        billYear : year,
        userName : user.userName
    })
    return NextResponse.json({message:"bill added successfully", bill:createBill, created:true})


} catch (error) {
    return NextResponse.json({message:error.message})
}

}