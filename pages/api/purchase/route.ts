// app/api/purchase/route.ts
import connect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import Purchase from "@/models/Purchase";
import { NextResponse } from "next/server"; 

export async function POST(req: Request) {
  const { userId, amount } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  await connect();

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await Purchase.findOne({ userId });
  const isFirstPurchase = !existing;

  const purchase = await Purchase.create({
    userId,
    amount,
    isFirstPurchase
  });

  if (isFirstPurchase) {
    // find referral record
    const referral = await Referral.findOne({ referredId: userId, credited: false });
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
