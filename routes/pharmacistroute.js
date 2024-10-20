const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { getAllPrescriptions } = require("../functions/pharmacist");
const {
  notifyPharmacistOfUpdatedPrescription,
} = require("../functions/pharmacist");
const { getPatientPrescription } = require("../functions/pharmacist");
const pool = require("../config/dbconfig");
const router = express.Router();

router.get("/view-prescriptions", verifyToken, async (req, res) => {
  const result = await getAllPrescriptions(req.user.role);

  if (result.error) {
    return res.status(403).json({ message: result.error });
  }

  res.status(200).json({
    message: "Prescription list retrieved successfully.",
    prescriptions: result,
  });
});

router.post("/notify-updated-prescription", verifyToken, (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({
      message: "Unauthorized: Only doctors can notify prescription updates.",
    });
  }

  const io = req.app.get("io");
  const { patientDetails } = req.body;

  notifyPharmacistOfUpdatedPrescription(io, patientDetails);

  res.status(200).json({
    message: "Pharmacists notified of updated prescription.",
  });
});
router.get("/prescription/:id", verifyToken, async (req, res) => {
  const patientId = req.params.id;

  if (req.user.role !== "pharmacist") {
    return res.status(403).json({
      message: "Unauthorized: Only pharmacists can view prescriptions.",
    });
  }

  const result = await getPatientPrescription(patientId, req.user.role);

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  res.status(200).json({
    message: "Prescription details retrieved successfully.",
    prescription: result.prescription,
  });
});

router.post("/mark-medicines-done/:id", verifyToken, async (req, res) => {
  const patientId = req.params.id;

  if (req.user.role !== "pharmacist") {
    return res.status(403).json({
      message: "Unauthorized: Only pharmacists can mark medicines as done.",
    });
  }

  try {
    const result = await pool.query(
      "UPDATE patients SET medicines_done = TRUE WHERE id = $1 RETURNING *",
      [patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({
      message: "Medicines marked as done for the patient.",
      patient: result.rows[0],
    });
  } catch (err) {
    console.error("Error marking medicines as done:", err);
    res.status(500).json({ message: "Failed to update the status." });
  }
});
module.exports = router;
