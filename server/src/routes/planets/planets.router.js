const express = require("express");
const { getPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/planets", getPlanets);

module.exports = planetsRouter;
