import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  referralCode: string;
  referredBy?: mongoose.Schema.Types.ObjectId | null;
  credits: number;
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
