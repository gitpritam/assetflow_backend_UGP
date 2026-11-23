import DesignationModel from "./designation.model.js";

export const createDesignation = async (req, res) => {
  try {
    const { name, status } = req.body;
    //validation
    if (!name || !status) {
      return res.status(400).json({ error: "Name and status are required" });
    }

    //duplicate check
    const exxistingDesignation = await DesignationModel.findOne({ name });

    if (exxistingDesignation) {
      return res.status(409).json({ error: "Designation already exists" });
    }

    //create designation
    const payload = {
      name,
      status,
    };
    const newDesignation = await DesignationModel.create(payload);
    if (!newDesignation) {
      return res.status(400).json({
        message: "Designation not created successfully",
      });
    }
    return res.status(201).json({
      message: "Designation created successfully",
      data: newDesignation,
    });
  } catch (error) {
    console.error("Error creating designation:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getDesignations = async (req, res) => {
  try {
    const designations = await DesignationModel.find();

    if (!designations || designations.length === 0) {
      return res.status(404).json({ message: "No designations found" });
    }

    return res.status(200).json({
      message: "Designations fetched successfully",
      data: designations,
    });
  } catch (error) {
    console.error("Error fetching designation:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getDesignation = async (req, res) => {
  try {
    const { id } = req.params; //url parameter
    const designation = await DesignationModel.findById(id);
    if (!designation) {
      return res.status(404).json({ message: "Designation not found." });
    }

    return res.status(200).json({
      message: "Designation fetched successfully",
      data: designation,
    });
  } catch (error) {
    console.error("Error fetching designation:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params; //url parameter
    const designation = await DesignationModel.findByIdAndDelete(id);
    if (!designation) {
      return res.status(404).json({ message: "Designation not found." });
    }

    return res.status(200).json({
      message: "Designation deleted successfully",
      data: designation,
    });
  } catch (error) {
    console.error("Error deleting designation:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
