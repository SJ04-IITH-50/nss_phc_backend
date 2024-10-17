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

const registerUser = async (email, password, role) => {
  try {

    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return { error: 'User already exists' };
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING email, role',
      [email, hashedPassword, role]
    );

    return { email: result.rows[0].email, role: result.rows[0].role };
  } catch (err) {
    console.error('Error registering user:', err);
    return { error: 'Failed to register user' };
  }
};

module.exports = { registerUser, loginUser };
