import mongoose, { Schema, Types } from "mongoose";
import {
  genders,
  providers,
  roles,
} from "../../utils/enums/index.js";
import {
  decrypt,
  encrypt,
  hash,
} from "../../utils/index.js";

export const defaultSecureUrl =
  "https://res.cloudinary.com/dvsxd6dmo/image/upload/v1738927588/samples/animals/kitten-playing.gif";
export const defaultProfileSecureUrl =
  "https://res.cloudinary.com/dvsxd6dmo/image/upload/v1738927588/samples/animals/kitten-playing.gif";

export const defaultCoverSecureUrl =
  "https://res.cloudinary.com/dygtfwj8l/image/upload/v1741127796/samples/cup-on-a-table.jpg";

export const defaultPublicId =
  "https://res.cloudinary.com/dygtfwj8l/image/upload/v1741127796/samples/cup-on-a-table.jpg";

export const defaultProfilePublicId =
  "samples/animals/kitten-playing";

export const defaultCoverPublicId =
  "samples/cup-on-a-table";

const calculateAge = (dob) => {
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    return age - 1;
  }
  return age;
};

// user Schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,

      minLength: [
        3,
        "First name must be at least 3 characters long",
      ],
      maxLength: [
        20,
        "First name must be at most 50 characters long",
      ],
    },
    lastName: {
      type: String,

      minLength: [
        3,
        "Last name must be at least 3 characters long",
      ],
      maxLength: [
        20,
        "Last name must be at most 50 characters long",
      ],
    },
    email: {
      type: String,

      unique: [true, "Email is required"],
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: function () {
        return this.provider == "system" ? true : false;
      },
      unique: [true, "Mobile number is required"],
    },
    password: {
      type: String,
      required: function () {
        return this.provider == "system" ? true : false;
      },
    },
    role: {
      type: String,
      enum: [
        roles.USER,
        roles.HR,
        roles.ADMIN,
        roles.OWNER,
      ],
      default: roles.USER,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: [providers.SYSTEM, providers.GOOGLE],
      default: providers.SYSTEM,
    },
    gender: {
      type: String,
      enum: [genders.MALE, genders.FEMALE],
      default: genders.MALE,
    },
    dob: {
      type: Date,
      required: function () {
        return this.provider == "system" ? true : false;
      },
      validate: {
        validator: function (value) {
          if (!value || value >= new Date()) {
            return false;
          }
          return calculateAge(value) >= 18;
        },
        message: "Age must be greater than 18",
      },
    },
    deletedAt: {
      type: Date,
    },
    bannedAt: {
      type: Date,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    changeCredentialsAt: {
      type: Date,
    },
    profilePic: {
      secure_url: {
        type: String,
        default: defaultProfileSecureUrl,
      },
      public_id: {
        type: String,
        default: defaultProfilePublicId,
      },
    },
    coverPic: {
      secure_url: {
        type: String,
        default: defaultCoverSecureUrl,
      },
      public_id: {
        type: String,
        default: defaultCoverPublicId,
      },
    },
    otp: [
      {
        code: { type: String },
        otp_type: {
          type: String,
          enum: ["confirm-email", "forget-password"],
        },
        expiresIn: { type: Date },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    bannedAt: {
      type: Date,
    },
    bannedByAdmin: {
      type: Boolean,
      default: false,
    },
    bannedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("userName").get(function () {
  const first = this.firstName;
  const last = this.lastName;
  return `${first} ${last}`.trim();
});

userSchema.pre("save", function (next) {
  if (this.isModified("password", "mobileNumber")) {
    this.password = hash(this.password, 10);
  }
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({
      data: this.mobileNumber,
    });
  }
  return next();
});

userSchema.post("findOne", function (doc) {
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = decrypt({ data: doc.mobileNumber });
  }
});
// user Model
export const User = mongoose.model("User", userSchema);
