import connect from "@/lib/mongodb";
import User from "@/models/User";
import Purchase from "@/models/Purchase";
import Referral from "@/models/Referral";
import { NextResponse } from "next/server";

interface ReferralUser {
  _id: string;
  name: string;
  purchased: boolean;
}

// Define type for populated referral
interface PopulatedReferral {
  referredId: {
    _id: string;
    name: string;
    credits?: number;
  } | null;
}

export async function GET(req: Request) {
  await connect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 1️⃣ Find all users this user referred
  const referrals = (await Referral.find({ referrerId: user._id }).populate(
    "referredId",
    "name credits"
  )) as PopulatedReferral[]; // cast to proper type

  const referredCount = referrals.length;

  // 2️⃣ Count this user's own purchases
  const purchasedCount = await Purchase.countDocuments({ userId: user._id });

  // 3️⃣ Map referred users for frontend
  const referralUsers: ReferralUser[] = referrals
    .map((r) => {
      const refUser = r.referredId;
      if (!refUser?._id) return null; // type guard

      return {
        _id: refUser._id.toString(),
        name: refUser.name,
        purchased: (refUser.credits || 0) > 0, // true if first purchase credited
      };
    })
    .filter((u): u is ReferralUser => u !== null); // type guard

  return NextResponse.json({
    user,
    referredCount,
    purchasedCount, // only this user's own purchases
    referralUsers,  // referred users with purchased status
  });
}
