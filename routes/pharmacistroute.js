const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { getAllPrescriptions } = require("../functions/pharmacist");
const {
  notifyPharmacistOfUpdatedPrescription,
  getMedicinesByPatientId,
  updateMedicineStatus,
  markPrescriptionAsDone,
} = require("../functions/pharmacist");
const { getPatientPrescription } = require("../functions/pharmacist");
const pool = require("../config/dbconfig");
const router = express.Router();

router.get("/view-prescriptions", verifyToken, async (req, res) => {
  const result = await getAllPrescriptions(req.user.role, req.user.hospital_id);

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

  const result = await getPatientPrescription(patientId, req.user.role, req.user.hospital_id);

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

  const result = await markPrescriptionAsDone(patientId, req.user.hospital_id);

  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.status(200).json({
    message: "Medicines marked as done for the patient.",
  });
});

router.get("/prescription/:id/medicines", verifyToken, async (req, res) => {
  const patientId = req.params.id;

  if (req.user.role !== "pharmacist") {
    return res.status(403).json({ message: "Unauthorized." });
  }

  const result = await getMedicinesByPatientId(patientId, req.user.hospital_id);

  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.status(200).json({ medicines: result });
});

router.post("/medicine/:id/done", verifyToken, async (req, res) => {
  const medicineId = req.params.id;
  const { done } = req.body;

  if (req.user.role !== "pharmacist") {
    return res.status(403).json({ message: "Unauthorized." });
  }

  const result = await updateMedicineStatus(
    medicineId,
    done,
    req.user.hospital_id
  );

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  res.status(200).json({
    message: "Medicine status updated successfully.",
    medicine: result.medicine,
  });
});

router.post("/prescription/:id/mark-done", verifyToken, async (req, res) => {
  const prescriptionId = req.params.id;

  if (req.user.role !== "pharmacist") {
    return res.status(403).json({ message: "Unauthorized access." });
  }

  const result = await markPrescriptionAsDone(prescriptionId);

  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res
    .status(200)
    .json({ message: "Prescription marked as done successfully." });
});

module.exports = router;
