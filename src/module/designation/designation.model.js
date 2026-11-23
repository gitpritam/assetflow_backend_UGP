import mongoose from "mongoose";

const designationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
);

const DesignationModel = mongoose.model("Designations", designationSchema);

export default DesignationModel;
