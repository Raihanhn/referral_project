import mongoose, { Schema } from "mongoose";

const ReferralSchema = new Schema({
  referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  referredId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  credited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default (mongoose.models.Referral as mongoose.Model<any>) ||
  mongoose.model("Referral", ReferralSchema);
