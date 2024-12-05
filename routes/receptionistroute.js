const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { addPatient } = require("../functions/receptionist");
const { notifyDoctorsOfNewPatient } = require("../functions/doctor");

const router = express.Router();

router.post("/add-patient", verifyToken, async (req, res) => {
  const { name, age, gender, aadhar_number } = req.body;

  if (!name || !age || !gender || !aadhar_number) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Add the hospital_id from the logged-in receptionist's token
  const patientDetails = {
    name,
    age,
    gender,
    aadhar_number,
    hospital_id: req.user.hospital_id, // Extracted from the JWT token
  };

  const result = await addPatient(patientDetails, req.user.role);

  if (result.error) {
    return res.status(403).json({ message: result.error });
  }

  // Notify doctors of the new patient
  const io = req.app.get("io");
  notifyDoctorsOfNewPatient(io, result);

  res.status(201).json({
    message: "Patient added successfully!",
    patient: result,
  });
});

module.exports = router;