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

interface PopulatedReferral {
  referredId: {
    _id: string;
    name: string;
    credits?: number;
  } | null;
}

export async function GET(req: Request) {
  try {
    await connect();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdStr = (user as { _id: any })._id.toString();

    const referrals = (await Referral.find({ referrerId: userIdStr })
      .populate("referredId", "name credits")) as PopulatedReferral[];

    const referredCount = referrals.length;

    const purchasedCount = await Purchase.countDocuments({ userId: userIdStr });

    const referralUsers: ReferralUser[] = referrals
      .map((r) => {
        const refUser = r.referredId;
        if (!refUser?._id) return null;

        return {
          _id: refUser._id.toString(),
          name: refUser.name,
          purchased: (refUser.credits || 0) > 0,
        };
      })
      .filter((u): u is ReferralUser => u !== null);

    const safeUser = { ...user };
    delete (safeUser as any).passwordHash;

    return NextResponse.json({
      user: safeUser,
      referredCount,
      purchasedCount,
      referralUsers,
    });
  } catch (err: unknown) {
    console.error("Referral GET error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch referrals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
