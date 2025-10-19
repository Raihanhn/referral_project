import connect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import Purchase from "@/models/Purchase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Count of users referred by this user
  const referredCount = await Referral.countDocuments({ referrerId: user._id });

  // Count of purchases by this user (bought)
  const purchasedCount = await Purchase.countDocuments({ userId: user._id });

  // Fetch all referred users for dashboard
  const referrals = await Referral.find({ referrerId: user._id }).populate(
    "referredId",
    "name email credits"
  );

  // Map for dashboard display
  const referralUsers = referrals.map((r) => ({
    id: (r.referredId as any)._id.toString(),
    name: (r.referredId as any).name,
    purchased: (r.referredId as any).credits > 0, // check if referred user has credits
  }));

  return NextResponse.json({ user, referredCount, purchasedCount, referralUsers });
}
