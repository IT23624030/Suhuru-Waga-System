const mongoose = require("mongoose");
const Resource = require("../Model/Resources");
const Booking = require("../Model/BookingModel"); // Added for deleting bookings

// ===== Helper to safely convert userId =====
const safeObjectId = (id) =>
  id && mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : undefined;

// ===================== GET ALL RESOURCES =====================
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    if (!resources || resources.length === 0) {
      return res.status(404).json({ message: "No resources found" });
    }
    res.status(200).json(resources);
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// ===================== GET RESOURCE BY ID =====================
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(resource);
  } catch (err) {
    console.error("Error fetching resource:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// ===================== GET RESOURCES BY USER =====================
const getResourcesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const resources = await Resource.find({ "metadata.createdBy": safeObjectId(userId) });
    if (!resources || resources.length === 0)
      return res.status(404).json({ message: "No resources found for this user" });

    res.status(200).json(resources);
  } catch (err) {
    console.error("Error fetching user resources:", err);
    res.status(500).json({ error: "Failed to fetch resources for user" });
  }
};

// ===================== CREATE RESOURCE =====================
const createResource = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      imageUrl,
      providerName,
      availability,
      pricing,
      shortageFlags,
      metadata,
    } = req.body;

    const createdById = metadata?.createdBy ? safeObjectId(metadata.createdBy) : undefined;

    const newResource = new Resource({
      name,
      category,
      description,
      imageUrl: imageUrl || "",
      providerName,
      availability: availability || { totalUnits: 0, availableUnits: 0 },
      pricing: pricing || { baseRate: 0, maxPriceCeiling: 0 },
      shortageFlags: shortageFlags || { isLowStock: false, threshold: 5 },
      metadata: {
        createdBy: createdById,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ error: "Failed to create resource", details: err.message });
  }
};

// ===================== UPDATE RESOURCE =====================
const updateResource = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      imageUrl,
      providerName,
      availability,
      pricing,
      shortageFlags,
      metadata,
    } = req.body;

    const updateData = {
      name,
      category,
      description,
      imageUrl,
      providerName,
      availability,
      pricing,
      shortageFlags,
      metadata: metadata
        ? {
            ...metadata,
            lastUpdated: new Date(),
          }
        : undefined,
    };

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedResource) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(updatedResource);
  } catch (err) {
    console.error("Error updating resource:", err);
    res.status(500).json({ error: "Failed to update resource", details: err.message });
  }
};

// ===================== DELETE RESOURCE =====================
const deleteResource = async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Error deleting resource:", err);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};

// ===================== DELETE RESOURCE + BOOKINGS =====================
const deleteResourceWithBookings = async (req, res) => {
  const resourceId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(resourceId))
    return res.status(400).json({ message: "Invalid resource ID" });

  try {
    // Delete related bookings
    const deletedBookings = await Booking.deleteMany({ resourceId });

    // Delete resource
    const deletedResource = await Resource.findByIdAndDelete(resourceId);
    if (!deletedResource)
      return res.status(404).json({ message: "Resource not found" });

    res.status(200).json({
      message: "Resource and related bookings deleted successfully",
      deletedResourceId: deletedResource._id,
      deletedBookingsCount: deletedBookings.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting resource with bookings:", err);
    res.status(500).json({
      error: "Failed to delete resource and bookings",
      details: err.message,
    });
  }
};

// ===================== DELETE ALL RESOURCES =====================
const deleteAllResources = async (req, res) => {
  try {
    const result = await Resource.deleteMany({});
    res.status(200).json({
      message: "All resources deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting all resources:", err);
    res.status(500).json({ error: "Failed to delete all resources", details: err.message });
  }
};

// ===================== BULK CREATE RESOURCES =====================
const createMultipleResources = async (req, res) => {
  try {
    const resourcesData = req.body;
    if (!Array.isArray(resourcesData) || resourcesData.length === 0) {
      return res.status(400).json({ message: "Please provide an array of resources" });
    }

    const processedData = resourcesData.map((r) => ({
      ...r,
      metadata: r.metadata
        ? { ...r.metadata, createdBy: safeObjectId(r.metadata.createdBy), createdAt: new Date() }
        : { createdBy: undefined, createdAt: new Date() },
    }));

    const savedResources = await Resource.insertMany(processedData, { ordered: false });
    res.status(201).json({
      message: "Resources added successfully",
      count: savedResources.length,
      resources: savedResources,
    });
  } catch (err) {
    console.error("Error adding multiple resources:", err);
    res.status(500).json({ error: "Failed to add multiple resources", details: err.message });
  }
};

// ===================== BULK UPDATE RESOURCES =====================
const updateMultipleResources = async (req, res) => {
  try {
    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Please provide an array of updates" });
    }

    const bulkOps = updates.map((item) => {
      const updateData = { ...item.data };
      if (updateData.metadata?.createdBy)
        updateData.metadata.createdBy = safeObjectId(updateData.metadata.createdBy);
      updateData.metadata = {
        ...updateData.metadata,
        lastUpdated: new Date(),
      };

      return {
        updateOne: {
          filter: { _id: safeObjectId(item.id) },
          update: { $set: updateData },
        },
      };
    });

    const result = await Resource.bulkWrite(bulkOps);
    res.status(200).json({
      message: "Resources updated successfully",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error updating multiple resources:", err);
    res.status(500).json({ error: "Failed to update multiple resources", details: err.message });
  }
};

// ===================== EXPORT =====================
module.exports = {
  getAllResources,
  getResourceById,
  getResourcesByUser,
  createResource,
  updateResource,
  deleteResource,
  deleteResourceWithBookings, // ✅ new
  deleteAllResources,
  createMultipleResources,
  updateMultipleResources,
};
