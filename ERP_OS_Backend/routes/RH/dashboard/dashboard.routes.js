const express = require("express");
const { getDashboardDataRH } = require("./dashboard.controllers");
const authorize = require("../../../utils/authorize"); // authentication middleware

const dashboardRHRoutes = express.Router();

dashboardRHRoutes.get("/", authorize("ReadDashboardHR"), getDashboardDataRH);

module.exports = dashboardRHRoutes;
