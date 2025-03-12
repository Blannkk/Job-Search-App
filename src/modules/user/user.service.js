import {
  defaultPublicId,
  defaultSecureUrl,
  User,
} from "../../db/model/user.model.js";
import cloudinary from "../../utils/file-upload/cloud-config.js";
import { compare } from "../../utils/index.js";
import { messages } from "../../utils/messages/index.js";

export const updateProfile = async (req, res, next) => {
  const { firstName, lastName, mobileNumber, dob, gender } =
    req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new Error(messages.user.notFound, { cause: 404 })
    );
  }

  if (firstName !== undefined) {
    user.firstName = firstName;
  }
  if (lastName !== undefined) {
    user.lastName = lastName;
  }
  if (mobileNumber !== undefined) {
    user.mobileNumber = mobileNumber;
  }

  if (dob !== undefined) {
    try {
      user.dob = new Date(dob);
    } catch (error) {
      return next(
        new Error("Invalid date format for dob", {
          cause: 400,
        })
      );
    }
  }

  if (gender !== undefined) {
    user.gender = gender;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: messages.user.updated,
    data: user,
  });
};

export const getMyProfile = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!user) {
    return next(
      new Error(messages.user.notFound, { cause: 404 })
    );
  }

  return res.status(200).json({
    success: true,
    data: user,
    message: messages.user.fetched,
  });
};
export const getProfile = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    id,
    isDeleted: false,
  });

  if (!user || user.isDeleted == true) {
    return next(
      new Error(messages.user.notFound, { cause: 404 })
    );
  }

  return res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      mobileNumber: user.mobileNumber,
      coverPic: user.coverPic,
      userName: user.userName,
      profilePic: user.profilePic.secure_url,
    },
    message: messages.user.fetched,
  });
};

export const changePassword = async (req, res, next) => {
  const { id } = req.user;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(
      new Error(messages.user.notFound, { cause: 404 })
    );
  }

  const isPasswordMatch = compare({
    Value: oldPassword,
    hashedValue: user.password,
  });

  console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    return next(
      new Error(messages.user.wongPassword, { cause: 400 })
    );
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: messages.user.passwordChanged,
  });
};

export const uploadProfileOrCoverPicCloud = async (
  req,
  res,
  next
) => {
  const { pic_type } = req.params;
  let folderPath = `JobSearchApp/users/${req.user._id}/ProfilePic`;
  let updateField = "profilePic";

  if (pic_type === "cover-pic") {
    folderPath = `JobSearchApp/users/${req.user._id}/CoverPic`;
    updateField = "coverPic";
  } else if (pic_type !== "profile-pic") {
    return next(
      new Error("Invalid picture type", { cause: 400 })
    );
  }

  // Delete old picture if exists
  if (
    req.user[updateField] &&
    req.user[updateField].public_id
  ) {
    await cloudinary.uploader.destroy(
      req.user[updateField].public_id
    );
  }

  // Upload new image to Cloudinary
  const { secure_url, public_id } =
    await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
    });

  const update = {
    [updateField]: { secure_url, public_id },
  };
  const user = await User.findByIdAndUpdate(
    req.user._id,
    update,
    { new: true }
  );

  return res.status(200).json({
    success: true,
    messages: messages.user.updated,
    data: user,
  });
};

export const deleteProfilePic = async (req, res, next) => {
  const { pic_type } = req.params;

  let folderPath = `JobSearchApp/users/${req.user._id}/ProfilePic`;
  let deleteField = "profilePic";

  if (pic_type === "cover-pic") {
    folderPath = `JobSearchApp/users/${req.user._id}/CoverPic`;
    deleteField = "coverPic";
  } else if (pic_type !== "profile-pic") {
    return next(
      new Error("Invalid picture type", { cause: 400 })
    );
  }

  if (
    req.user[deleteField] &&
    req.user[deleteField].public_id
  ) {
    await cloudinary.uploader.destroy(
      req.user[deleteField].public_id
    );
  }
  const update = {
    [deleteField]: {
      secure_url: defaultSecureUrl,
      public_id: defaultPublicId,
    },
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    update,
    { new: true }
  );

  return res.status(200).json({
    success: true,
    messages: messages.user.photoDeleted,
  });
};

export const freezeAccount = async (req, res, next) => {
  await User.updateOne(
    { _id: req.user._id },
    { isDeleted: true, deletedAt: Date.now() }
  );

  return res.status(200).json({
    success: true,
    messages: messages.user.deleted,
  });
};
