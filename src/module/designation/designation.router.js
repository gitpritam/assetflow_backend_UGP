import { Router } from "express";
import {
  createDesignation,
  deleteDesignation,
  getDesignation,
  getDesignations,
  updateDesignation,
} from "./designation.controller.js";

const designationRouter = Router();
// /api/v1/designation

designationRouter.post("/", createDesignation);
designationRouter.get("/", getDesignations);
designationRouter.get("/:id", getDesignation);
designationRouter.patch("/:id", updateDesignation);
designationRouter.delete("/:id", deleteDesignation);
export default designationRouter;
