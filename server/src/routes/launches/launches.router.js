const express = require("express");
const { httpGetLaunches, httpPostLaunch, httpAbortLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetLaunches);
launchesRouter.post("/", httpPostLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
