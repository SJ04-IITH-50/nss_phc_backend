const pool = require("../config/dbconfig");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/jwt");

const loginUser = async (email, password) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return { error: "User not found." };
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: "Invalid password." };
    }
    const token = generateToken({ name: user.name, role: user.role });

    return { token, name: user.name, role: user.role };
  } catch (err) {
    console.error(err);
    return { error: "Login failed due to an internal error." };
  }
};

module.exports = {
  loginUser,
};
