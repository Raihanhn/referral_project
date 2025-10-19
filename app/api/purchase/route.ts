// app/api/purchase/route.ts
import connect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import Purchase from "@/models/Purchase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connect();

  // Get the user from the session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { amount } = await req.json();
  if (!amount || typeof amount !== "number") {
    return NextResponse.json({ error: "Missing or invalid amount" }, { status: 400 });
  }

  // Check if it's the first purchase
  const existing = await Purchase.findOne({ userId: user._id });
  const isFirstPurchase = !existing;

  // Create purchase record
  const purchase = await Purchase.create({
    userId: user._id,
    amount,
    isFirstPurchase,
  });

  // If first purchase, update referral credits
  if (isFirstPurchase) {
    const referral = await Referral.findOne({ referredId: user._id, credited: false });
    if (referral) {
      const referrer = await User.findById(referral.referrerId);
      if (referrer) {
        referrer.credits = (referrer.credits || 0) + 2;
        await referrer.save();
      }
      user.credits = (user.credits || 0) + 2;
      await user.save();

      referral.credited = true;
      await referral.save();
    }
  }

  return NextResponse.json({ ok: true, purchase });
}
