const express = require("express");

const {
  createSingleDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateSingleDepartment,
  deleteDepartment,
} = require("./department.controller");
const authorize = require("../../../../utils/authorize"); // authentication middleware

const departmentRoutes = express.Router();

departmentRoutes.post(
  "/",
  authorize("create-department"),
  createSingleDepartment
);
departmentRoutes.get("/", authorize("readAll-department"), getAllDepartment);
departmentRoutes.get("/:id", authorize(""), getSingleDepartment);
departmentRoutes.put(
  "/:id",
  authorize("update-department"),
  updateSingleDepartment
);
departmentRoutes.delete(
  "/:id",
  authorize("delete-department"),
  deleteDepartment
);

module.exports = departmentRoutes;
