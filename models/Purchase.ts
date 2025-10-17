import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  isFirstPurchase: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default (mongoose.models.Purchase as mongoose.Model<any>) ||
  mongoose.model("Purchase", PurchaseSchema);
