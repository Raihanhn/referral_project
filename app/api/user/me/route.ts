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
  await connect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

 const referrals = (await Referral.find({ referrerId: (user as any)._id })
  .populate("referredId", "name credits")) as PopulatedReferral[];


  const referredCount = referrals.length;

 const purchasedCount = await Purchase.countDocuments({ userId: (user as any)._id });



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

  return NextResponse.json({
    user,
    referredCount,
    purchasedCount, 
    referralUsers,  
  });
}
