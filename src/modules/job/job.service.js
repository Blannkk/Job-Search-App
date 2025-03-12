import { Job } from "../../db/model/job.model.js";
import { Company } from "./../../db/model/company.model.js";
import { messages } from "./../../utils/messages/index.js";

export const createJob = async (req, res, next) => {
  const { id, role } = req.user;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
    company,
  } = req.body;

  const { _id, createdBy, HRs } = await Company.findById(
    company
  );

  if (!_id) {
    return next(
      new Error(messages.company.notFound, { cause: 404 })
    );
  }

  const isAllowed =
    createdBy.toString() === id.toString() ||
    HRs.map((hr) => hr.toString()).includes(id.toString());

  if (!isAllowed) {
    return next(
      new Error(messages.user.unAuthorized, {
        cause: 401,
      })
    );
  }

  const job = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: id,
    company: _id,
  });

  return res.status(201).json({
    success: true,
    message: messages.job.created,
    data: job,
  });
};

export const updateJob = async (req, res, next) => {
  // const { userId } = req.user;
  const { id } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const job = await Job.findById({ _id: id }).populate({
    path: "company",
    select: "createdBy HRs",
  });

  if (!job) {
    return next(
      new Error(messages.job.notFound, { cause: 404 })
    );
  }

  const isAllowed =
    job.addedBy.toString() === req.user._id ||
    job.company.HRs.map((hr) => hr.toString()).includes(
      req.user._id.toString()
    );

  if (!isAllowed) {
    return next(
      new Error(messages.user.unAuthorized, {
        cause: 401,
      })
    );
  }

  job.jobTitle = jobTitle || job.jobTitle;
  job.jobLocation = jobLocation || job.jobLocation;
  job.workingTime = workingTime || job.workingTime;
  job.seniorityLevel = seniorityLevel || job.seniorityLevel;
  job.jobDescription = jobDescription || job.jobDescription;
  job.technicalSkills =
    technicalSkills || job.technicalSkills;
  job.softSkills = softSkills || job.softSkills;

  await job.save();

  return res.status(200).json({
    success: true,
    data: job,
    message: messages.job.updated,
  });
};

export const getJobs = async (req, res, next) => {
  const { company, id } = req.params;
  // const { jobId } = req.query;

  const {
    page = 1,
    limit = 10,
    search,
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  const skip = (page - 1) * limit;

  let filter = { closed: false };

  if (company) {
    filter.company = company;
  }

  if (id) {
    filter._id = id;
  }

  if (search) {
    const company = await Company.findOne({
      companyName: { $regex: search, $options: "i" }, // Case-insensitive search
    });
    if (company) {
      filter.company = company._id;
    }
  }
  if (jobLocation) {
    filter.jobLocation = jobLocation.toLowerCase();
  }

  if (workingTime) {
    filter.workingTime = workingTime.toLowerCase();
  }

  if (seniorityLevel) {
    filter.seniorityLevel = seniorityLevel.toLowerCase();
  }

  if (jobTitle) {
    filter.jobTitle = { $regex: jobTitle, $options: "i" }; // Case-insensitive search
  }
  if (technicalSkills) {
    const skillsArray = technicalSkills
      .split(",")
      .map((skill) => skill.trim());
    filter.technicalSkills = { $all: skillsArray }; // Match all provided skills
  }

  const jobs = await Job.find(filter)
    .populate({
      path: "company",
      select: "companyName",
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: jobs,
    message: messages.job.fetched,
    currentPage: parseInt(page),
    totalPages: Math.ceil(
      (await Job.countDocuments(filter)) / limit
    ),
  });
};

export const deleteJob = async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById({ _id: id }).populate({
    path: "company",
    select: "createdBy HRs",
  });

  if (!job) {
    return next(
      new Error(messages.job.notFound, { cause: 404 })
    );
  }
  const isAllowed = job.company.HRs.map((hr) =>
    hr.toString()
  ).includes(req.user._id.toString());

  if (!isAllowed) {
    return next(
      new Error(messages.user.unAuthorized, {
        cause: 401,
      })
    );
  }

  await job.deleteOne();

  return res.status(200).json({
    success: true,
    message: messages.job.deleted,
  });
};
