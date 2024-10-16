const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { getAllPrescriptions } = require("../functions/pharmacist");
const {
  notifyPharmacistOfUpdatedPrescription,
} = require("../functions/pharmacist");
const { getPatientPrescription } = require("../functions/pharmacist");
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
    return res
      .status(403)
      .json({
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
module.exports = router;
