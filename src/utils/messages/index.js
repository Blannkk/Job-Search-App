const generateMessage = (entity) => ({
  created: `${entity} created successfully`,
  found: `${entity} found successfully`,
  updated: `${entity} updated successfully`,
  deleted: `${entity} deleted successfully`,
  notFound: `${entity} not found`,
  invalid: `Invalid ${entity}`,
  alreadyExists: `${entity} already exists`,
  failToCreate: `Failed to create ${entity}`,
  failToUpdate: `Failed to update ${entity}`,
  failToDelete: `Failed to delete ${entity}`,
  failToGet: `Failed to get ${entity}`,
});

export const messages = {
  user: {
    ...generateMessage("User"),
    unAuthorized:
      "You are Unauthorized to perform this action",
    invalidCredentials: "Invalid credentials",
    emailNotVerified: "Email not verified",
    fieldsAreRequired: "All fields are required",
    passwordChanged: "Password changed successfully",
    wongPassword: "Wrong password",
    photoChanged: "Photo changed successfully",
    photoDeleted: "Photo deleted successfully",
  },
  auth: {
    ...generateMessage("Auth"),
    invalidCredentials: "Invalid credentials",
  },
  job: {
    ...generateMessage("Job"),
  },
  company: {
    ...generateMessage("Company"),
  },
  application: {
    ...generateMessage("Application"),
  },
  otp: {
    ...generateMessage("OTP"),
  },
  email: {
    ...generateMessage("Email"),
    notSent: "Email not sent",
  },
};
