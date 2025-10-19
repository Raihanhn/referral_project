// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User";
import "@/lib/mongodb"; // auto-connect to MongoDB

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Generate a unique referral code (e.g. first 4 letters + random digits)
    const referralCode = (name.substring(0, 4) + Math.floor(1000 + Math.random() * 9000)).toUpperCase();

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      referralCode,
    });

    await newUser.save();

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
