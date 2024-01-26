import { connectDB } from "@/middleware/mongoose";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/[...nextauth]/options";
import { User } from "@/models/user";

export async function GET(req, res) {
    const session = await getServerAuthSession()
    console.log("admin session", session)
    if (!session) {
        return NextResponse.json({ message: "not authenticated" });
    }
    if (session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "unauthorized access" });
    }
    try {
        await connectDB()
        console.log("inside getUsers API")
        const allUsers = await User.find({role:"USER"})
        return NextResponse.json({ users: allUsers });
    } catch (error) {
        return NextResponse.json({ message: error.message });

    }
}