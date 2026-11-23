import { Router } from "express";
import designationRouter from "../../module/designation/designation.router.js";

const v1Router = Router();
//all module router will be added to this section
// localhost:5000/api/v1/designation
v1Router.use("/designation", designationRouter);
export default v1Router;
