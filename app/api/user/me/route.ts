import connect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import Purchase from "@/models/Purchase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connect();

  // For demo: get userId from query or session (replace with real session later)
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const referredCount = await Referral.countDocuments({ referrerId: user._id });
  const purchasedReferrals = await Referral.countDocuments({ referrerId: user._id, credited: true });

  return NextResponse.json({ user, referredCount, purchasedCount: purchasedReferrals });
}
