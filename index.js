import express from "express";
import bootstrap from "./src/app.controller.js";
import { initSocket } from "./src/socketio/index.js";
const app = express();

const port = process.env.PORT || 3000;
bootstrap(app, express);

const server = app.listen(port, () =>
  console.log("Example app listening on port port!", port)
);

initSocket(server);
