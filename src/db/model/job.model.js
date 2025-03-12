import mongoose, { Schema, Types } from "mongoose";
import {
  jobLevels,
  workingLocation,
  workingType,
} from "../../utils/enums/index.js";

//job schema

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: [
        workingLocation.REMOTELY,
        workingLocation.ONSITE,
        workingLocation.HYBRID,
      ],
    },
    workingTime: {
      type: String,
      required: true,
      enum: [workingType.FULL_TIME, workingType.PART_TIME],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: [
        jobLevels.INTERN,
        jobLevels.FRESH,
        jobLevels.JUNIOR,
        jobLevels.MID_LEVEL,
        jobLevels.SENIOR,
        jobLevels.TEAM_LEAD,
        jobLevels.CTO,
      ],
    },

    jobDescription: {
      type: String,
      required: true,
      minLength: [
        10,
        "Job description must be at least 10 characters long",
      ],
      maxLength: [
        250,
        "Job description must be at most 250 characters long",
      ],
    },
    technicalSkills: [
      {
        type: String,
        required: true,
      },
    ],
    softSkills: [
      {
        type: String,
        required: true,
      },
    ],
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    company: {
      type: Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual(" applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "job",
});

//job model
export const Job = mongoose.model("Job", jobSchema);
