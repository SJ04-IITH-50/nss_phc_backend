const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { getAllPatients } = require("../functions/doctor");
const { getPatientById, updatePatientDetails } = require("../functions/doctor");
const router = express.Router();

router.get("/view-patients", verifyToken, async (req, res) => {
  const result = await getAllPatients(req.user.role);

  if (result.error) {
    return res.status(403).json({ message: result.error });
  }

  res.status(200).json({
    message: "Patient list retrieved successfully.",
    patients: result,
  });
});

router.get("/patient/:id", verifyToken, async (req, res) => {
  const patientId = req.params.id;

  if (req.user.role !== "doctor") {
    return res.status(403).json({
      message: "Unauthorized: Only doctors can view patient details.",
    });
  }

  const result = await getPatientById(patientId);

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  res.status(200).json({
    message: "Patient details retrieved successfully.",
    patient: result.patient,
  });
});
router.post("/patient/update/:id", verifyToken, async (req, res) => {
  const patientId = req.params.id;
  const { complaint, medicines } = req.body;

  if (req.user.role !== "doctor") {
    return res
      .status(403)
      .json({
        message: "Unauthorized: Only doctors can update patient details.",
      });
  }
  const result = await updatePatientDetails(patientId, complaint, medicines);

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  res.status(200).json({
    message: "Patient details updated successfully.",
    patient: result.patient,
  });
});
module.exports = router;
