import http from "http";
import express from "express";
import bootstrap from "./src/app.controller.js";
import { initSocket } from "./src/socketio/index.js";

const app = express();
const port = process.env.PORT || 3000;

bootstrap(app, express);

const server = http.createServer(app);

initSocket(server);

server.listen(port, () =>
  console.log(`🚀 Server running on port ${port}`)
);
