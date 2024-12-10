const express = require("express");
const { loginUser, registerUser } = require("../functions/user");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, hospitalId } = req.body;

  if (!email || !password || !hospitalId) {
    return res
      .status(400)
      .json({ message: "Email, password, and hospital ID are required." });
  }

  const result = await loginUser(email, password, hospitalId);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  res.status(200).json({
    message: "Login successful",
    token: result.token,
    user: {
      name: result.name,
      role: result.role,
      hospital_id: hospitalId,
    },
  });
});

router.post("/register", async (req, res) => {
  const { email, password, role, hospitalId } = req.body;

  if (!email || !password || !role || !hospitalId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const result = await registerUser({ email, password, role, hospitalId });

  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.status(201).json({ message: "Signup successful!", user: result });
});

module.exports = router;
