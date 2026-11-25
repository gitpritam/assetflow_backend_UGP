import { safeParse } from "zod";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import CustomError from "../../shared/utils/CustomError.js";
import formatZodErrors from "../../shared/utils/formatZodErrors.js";
import DesignationModel from "./designation.model.js";
import DesignationValidationSchema, {
  UpdateDesignationValidationSchema,
} from "./designation.validation.js";

export const createDesignation = asyncHandler(async (req, res, next) => {
  const { name, status } = req.body || {};

  //validation
  const validationResult = safeParse(DesignationValidationSchema, {
    name,
    status,
  });

  if (validationResult.success === false) {
    return next(
      new CustomError(
        "Validation failed",
        400,
        formatZodErrors(validationResult.error),
      ),
    );
  }

  //duplicate check
  const exxistingDesignation = await DesignationModel.findOne({
    name: validationResult.data.name,
  });

  if (exxistingDesignation) {
    return next(new CustomError("Designation already exists", 409));
  }

  //create designation
  const payload = {
    name: validationResult.data.name,
    status: validationResult.data.status,
  };
  const newDesignation = await DesignationModel.create(payload);
  if (!newDesignation) {
    return next(new CustomError("Designation not created successfully", 400));
  }
  return res.status(201).json({
    message: "Designation created successfully",
    data: newDesignation,
  });
});

export const getDesignations = asyncHandler(async (req, res, next) => {
  //query params
  const { page, limit, sort, search } = req.query;

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const designations = await DesignationModel.find({
    name: { $regex: search || ".*", $options: "i" },
  })
    .limit(pageSize)
    .skip(skip)
    .sort(sort || "name");

  if (!designations || designations.length === 0) {
    return next(new CustomError("No designations found.", 404));
  }

  return res.status(200).json({
    message: "Designations fetched successfully",
    data: designations,
  });
});

export const getDesignation = asyncHandler(async (req, res, next) => {
  const { id } = req.params; //url parameter
  const designation = await DesignationModel.findById(id);
  if (!designation) {
    return next(new CustomError("Designation not found.", 404));
  }

  return res.status(200).json({
    message: "Designation fetched successfully",
    data: designation,
  });
});

export const updateDesignation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, status } = req.body || {};

  //validate and create payload
  const validationResult = safeParse(UpdateDesignationValidationSchema, {
    name,
    status,
  });

  if (validationResult.success === false) {
    return next(
      new CustomError(
        "Validation failed",
        400,
        formatZodErrors(validationResult.error),
      ),
    );
  }

  const payload = {};
  if (validationResult.data.name !== undefined) {
    payload.name = validationResult.data.name;
  }
  if (validationResult.data.status !== undefined) {
    payload.status = validationResult.data.status;
  }

  const updatedDesignation = await DesignationModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );
  if (!updatedDesignation) {
    return next(new CustomError("Designation not found.", 404));
  }
  return res.status(200).json({
    message: "Designation updated successfully",
    data: updatedDesignation,
  });
});
export const deleteDesignation = asyncHandler(async (req, res, next) => {
  const { id } = req.params; //url parameter
  const designation = await DesignationModel.findByIdAndDelete(id);
  if (!designation) {
    return next(new CustomError("Designation not found.", 404));
  }

  return res.status(200).json({
    message: "Designation deleted successfully",
    data: designation,
  });
});
