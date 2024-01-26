import mongoose from "mongoose";
import { connectDB } from "@/middleware/mongoose";
import { NextResponse } from "next/server";
import { User } from "@/models/user";
import { Bill } from "@/models/bill";
import { signIn } from "next-auth/react";

export async function POST(req, res) {
    try {
        const { email, password, userName } = await req.json();


        if (!email || !password || !userName) {
            return NextResponse.json({ message: "Please enter all fields" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: "User already exists", created: false });
        }

        const user = new User({ email, password, userName });
        await user.save();

        const userFromDB = await User.findOne({ email });
        const userData = {
            id: userFromDB._id,
            userName: userFromDB.userName,
            email: userFromDB.email,
            role: userFromDB.role
        };

        return NextResponse.json({ message: "User created successfully", created: true, user: userData });
    } catch (err) {
        return NextResponse.json({ message: err.message });
    }
}