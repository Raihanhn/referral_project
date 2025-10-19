// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // ✅ Ensure MongoDB is connected before any DB operation
    await connectDB();

    const { name, email, password } = await req.json();

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Generate unique referral code
    const referralCode = (name.substring(0, 4) + Math.floor(1000 + Math.random() * 9000)).toUpperCase();

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      passwordHash,
      referralCode,
    });

    await newUser.save();

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Registration error:", err);
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
