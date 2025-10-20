import connect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash || "");
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
