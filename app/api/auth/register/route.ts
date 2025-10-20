import connect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connect();

  try {
    const { name, email, password, ref } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode =
      name.substring(0, 4).toUpperCase() +
      Math.floor(1000 + Math.random() * 9000);

    // Find the referrer user by referral code
let referrerId = null;
if (ref) {
  const refUser = await User.findOne({ referralCode: ref });
  if (refUser) {
    referrerId = refUser._id; // ✅ MongoDB ObjectId
  }
}

// Create new user
const newUser = await User.create({
  name,
  email,
  passwordHash,
  referralCode,
  credits: 0,
  referredBy: referrerId,
});


    // Handle referral if present
    if (ref) {
      try {
        const referrer = await User.findOne({ referralCode: ref });
        if (referrer) {
          await Referral.create({
            referrerId: referrer._id,
            referredId: newUser._id,
            credited: false, // ✅ matches your schema
          });
        }
      } catch (err: unknown) {
        console.error("Registration error:", (err as Error).message || err);
        return NextResponse.json(
          { error: (err as Error).message || "Registration failed" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "User created", user: newUser },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 500 }
    );
  }
}
