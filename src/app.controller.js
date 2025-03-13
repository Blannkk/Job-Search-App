import cors from "cors";
import connectDB from "./db/connection.js";
import userRouter from "./modules/user/user.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import jobRouter from "./modules/job/job.controller.js";
import applicationRouter from "./modules/application/application.controller.js";

import { globalError } from "./utils/error/global-error.js";
import { notFound } from "./utils/error/not-found.js";
import { rateLimit } from "express-rate-limit";
import { application } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./app.schema.js";

const bootstrap = async (app, express) => {
  //rate limiting
  app.use(
    rateLimit({
      windowMs: 3 * 60 * 1000, // 15 minutes
      limit: 5, // limit each IP to 100 requests per window
    })
  );

  //cors
  app.use(cors("*"));

  //parse incoming requests with JSON payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // handle static files
  app.use("/uploads", express.static("uploads"));

  //connect to the database
  await connectDB();

  //handle qraphQl routes
  app.all(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const authorization =
          req.headers.authorization || "";
        return { authorization };
      },
      formatError: (error) => {
        return {
          success: false,
          statusCode: error.originalError?.cause || 500,
          message: error.originalError?.message,
        };
      },
    })
  );

  //handle all routes in REST

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/application", applicationRouter);
  //   app.use("/admin", adminRouter);

  //handle all invalid routes
  app.all("*", notFound);

  //global error middleware
  app.use(globalError);
};

export default bootstrap;
