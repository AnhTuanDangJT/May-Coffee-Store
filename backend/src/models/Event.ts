import { Schema, model, type Document, type Types } from "mongoose";

export interface EventDocument extends Document {
  title: string;
  description: string;
  date?: Date;
  location?: string;
  isPublished: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: false },
    location: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Event = model<EventDocument>("Event", eventSchema);


