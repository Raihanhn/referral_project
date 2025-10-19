// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, ref } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const referralCode = (name.substring(0, 4) + Math.floor(1000 + Math.random() * 9000)).toUpperCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      referralCode,
      credits: 0,
    });

    await newUser.save();

    // ✅ If user signed up with a referral code, create a referral record
    if (ref) {
      const referrer = await User.findOne({ referralCode: ref });
      if (referrer) {
        await Referral.create({
          referrerId: referrer._id,
          referredId: newUser._id,
          credited: false,
        });
      }
    }

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Registration error:", err);
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
