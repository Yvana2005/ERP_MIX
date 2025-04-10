const express = require("express");
const {
  createSingleDesignation,
  getAllDesignation,
  getSingleDesignation,
  updateSingleDesignation,
  allDesignationWiseEmployee,
  singleDesignationWiseEmployee,
  deleteSingleDesignation,
} = require("./designation.controllers");
const authorize = require("../../../../utils/authorize"); // authentication middleware

const designationRoutes = express.Router();
designationRoutes.get(
  "/employee",
  authorize("readAll-designationHistory"),
  allDesignationWiseEmployee
);
designationRoutes.get(
  "/employee/:id",
  authorize("viewDesignation"),
  singleDesignationWiseEmployee
);
designationRoutes.post(
  "/",
  authorize("createDesignation"),
  createSingleDesignation
);
designationRoutes.get("/", authorize("viewDesignation"), getAllDesignation);
designationRoutes.get(
  "/:id",
  authorize("viewDesignation"),
  getSingleDesignation
);
designationRoutes.put(
  "/:id",
  authorize("updateDesignation"),
  updateSingleDesignation
);

designationRoutes.delete(
  "/:id",
  authorize("deleteDesignation"),
  deleteSingleDesignation
);

module.exports = designationRoutes;
