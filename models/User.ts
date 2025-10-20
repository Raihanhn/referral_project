import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  referralCode: string;
  credits: number;
  referredBy?: mongoose.Types.ObjectId | null;
  totalPurchases?: number; // ✅ add this
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  credits: { type: Number, default: 0 },
  referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  totalPurchases: { type: Number, default: 0 }, // ✅ new field
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
