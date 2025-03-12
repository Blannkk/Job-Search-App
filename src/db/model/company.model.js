import mongoose, { Schema, Types } from "mongoose";

export const defaultLogoSecureUrl =
  "https://res.cloudinary.com/dygtfwj8l/image/upload/v1741127786/samples/landscapes/architecture-signs.jpg";
export const defaultLogoPublicId =
  "samples/landscapes/architecture-signs";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: String,
      enum: [
        "1-10",
        "11-20",
        "21-50",
        "51-100",
        "101-500",
        "501-1000",
        "1000+",
      ],
      required: true,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    HRs: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    legalAttachment: {
      type: {
        secure_url: String,
        public_id: String,
      },
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    rejectedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model(
  "Company",
  companySchema
);
