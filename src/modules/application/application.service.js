import { io } from "../../socketio/index.js";
import { Application } from "../../db/model/application.model.js";
import { Company } from "../../db/model/company.model.js";
import { Job } from "../../db/model/job.model.js";
import cloudinary from "../../utils/file-upload/cloud-config.js";
import { sendEmailEvent } from "../../utils/index.js";

export const applyForJob = async (req, res, next) => {
  const userId = req.user._id;
  const { jobId } = req.params;
  const userCV = req.file;
  if (!req.user.role === "user") {
    return next(
      new Error("Only users can apply for jobs", {
        cause: 404,
      })
    );
  }

  const job = await Job.find({ _id: jobId, closed: false });
  if (!job) {
    return next(
      new Error("Job not found or closed", { cause: 404 })
    );
  }

  const applicationFounded = await Application.findOne({
    jobId,
    userId,
  });

  if (applicationFounded) {
    return next(
      new Error("You have already applied for this job", {
        cause: 400,
      })
    );
  }
  const { secure_url, public_id } =
    await cloudinary.uploader.upload(req.file.path, {
      folder: `JobSearchApp/users/${req.user._id}/CV`,
    });

  const application = await Application.create({
    job: jobId,
    user: req.user._id,
    userCV: {
      secure_url,
      public_id,
    },
  });

  const company = await Company.findById(
    job.companyId
  ).populate("HRs", "_id");

  if (company) {
    company.HRs.forEach((hr) => {
      io.to(hr._id.toString()).emit("newApplication", {
        message: `New application for job: ${job.jobTitle}`,
        jobId,
        userId,
        applicationId: application._id,
      });
    });
  }
  return res.status(201).json({
    success: true,
    messages: "Application Submitted Successfully",
  });
};

export const getApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const job = await Job.findById(jobId).populate(
      "company",
      "createdBy HRs"
    );

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    const isCompanyOwner =
      job.company.createdBy.toString() === req.user._id;

    const isHR = job.company.HRs.map((hr) =>
      hr.toString()
    ).includes(req.user._id.toString());

    if (!isCompanyOwner && !isHR) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You must be the company owner or an HR.",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate({
        path: "user",
        select: "firstName lastName userName email ",
        options: { virtuals: true },
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCount = await Application.countDocuments({
      job: jobId,
    });

    return res.status(200).json({
      success: true,
      data: applications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptOrRejectApplication = async (
  req,
  res,
  next
) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return next(
      new Error("Invalid status", {
        cause: 400,
      })
    );
  }

  const application = await Application.findById(
    applicationId
  ).populate([
    {
      path: "job",
      populate: {
        path: "company",
        select: "createdBy HRs",
      },
    },
    {
      path: "user",
      select: "firstName lastName userName email",
    },
  ]);

  if (!application) {
    return next(
      new Error("Application not found", {
        cause: 404,
      })
    );
  }

  const isCompanyOwner =
    application.job.company.createdBy.toString() ===
    req.user._id;

  const isHR = application.job.company.HRs.map((hr) =>
    hr.toString()
  ).includes(req.user._id.toString());

  if (!isCompanyOwner && !isHR) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. You must be the company owner or an HR.",
    });
  }

  application.status = status;
  await application.save();

  sendEmailEvent.emit(
    "sendApplicationEmail",
    application.user.email,
    application.job.jobTitle,
    status
  );

  return res.status(200).json({
    success: true,
    message: `Application ${status} successfully`,
  });
};
