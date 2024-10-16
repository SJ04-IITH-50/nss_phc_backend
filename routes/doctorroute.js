const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { getAllPatients } = require("../functions/doctor");

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

module.exports = router;
