const pool = require("../config/dbconfig");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/jwt");

const loginUser = async (email, password, hospitalId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND hospital_id = $2",
      [email, hospitalId]
    );

    if (result.rows.length === 0) {
      return { error: "User not found or incorrect hospital ID." };
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid password." };
    }
    const token = generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
      hospital_id: hospitalId,
    });

    return { token, name: user.name, role: user.role };
  } catch (err) {
    console.error("Error during login:", err);
    return { error: "Login failed due to an internal error." };
  }
};
const registerUser = async ({ email, password, role, hospitalId }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users ( email, password, role, hospital_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [ email, hashedPassword, role, hospitalId]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error during signup:", err);
    return { error: "Signup failed. Please try again." };
  }
};


module.exports = { registerUser, loginUser };
