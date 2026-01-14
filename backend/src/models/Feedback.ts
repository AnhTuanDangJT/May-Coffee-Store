import { Schema, model, type Document, type Types } from "mongoose";

export interface FeedbackDocument extends Document {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Feedback = model<FeedbackDocument>("Feedback", feedbackSchema);

