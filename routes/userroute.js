const express = require("express");
const { loginUser,registerUser } = require("../functions/user");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const result = await loginUser(email, password);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  res.status(200).json({
    message: "Login successful",
    token: result.token,
    user: {
      name: result.name,
      role: result.role,
    },
  });
});
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;


  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required." });
  }

  
  const result = await registerUser(email, password, role);


  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: {
      email: result.email,
      role: result.role,
    },
  });
});
module.exports = router;
