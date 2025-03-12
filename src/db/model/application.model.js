import mongoose, { Schema, Types } from "mongoose";
import { applicationStatus } from "../../utils/enums/index.js";

// application schema
const applicationSchema = new Schema(
  {
    job: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCV: {
      secure_url: {
        type: String,
        required: true,
      },

      public_id: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: [
        applicationStatus.ACCEPTED,
        applicationStatus.REJECTED,
        applicationStatus.PENDING,
        applicationStatus.INCONSIDERATION,
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

applicationSchema.virtual("userData", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

// application model
export const Application = mongoose.model(
  "Application",
  applicationSchema
);
