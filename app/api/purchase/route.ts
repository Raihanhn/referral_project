import connect from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";
import Purchase from "@/models/Purchase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connect();

    // ✅ Get user ID from headers
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Parse request body
    const body = await req.json();
    const amount = Number(body.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid purchase amount" }, { status: 400 });
    }

    // ✅ Check if this is user's first purchase
    const existingPurchase = await Purchase.findOne({ userId: user._id });
    const isFirstPurchase = !existingPurchase;

    // ✅ Create new purchase
    const purchase = await Purchase.create({
      userId: user._id,
      amount,
      isFirstPurchase,
    });

    // ✅ Track total purchases for user
    user.totalPurchases = (user.totalPurchases || 0) + 1;

    // ✅ First purchase bonus logic
    if (isFirstPurchase) {
      // 🎁 Give credits to buyer
      user.credits = (user.credits || 0) + 2;

      // 🎁 Check referral & give credit once to referrer
      const referral = await Referral.findOne({ referredId: user._id, credited: false });
      if (referral) {
        const referrer = await User.findById(referral.referrerId);
        if (referrer) {
          referrer.credits = (referrer.credits || 0) + 2;
          await referrer.save();
        }

        // ✅ Mark referral as credited so it's not reused
        referral.credited = true;
        await referral.save();
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: isFirstPurchase
        ? "🎉 First purchase bonus credited successfully!"
        : "✅ Purchase recorded successfully!",
      data: {
        purchase,
        userCredits: user.credits,
        totalPurchases: user.totalPurchases,
      },
    });
  } catch (err: any) {
    console.error("Purchase API error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
