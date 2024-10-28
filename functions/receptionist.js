const pool = require("../config/dbconfig");

const addPatient = async (patientDetails) => {
  const { name, age, gender, aadhar_number } = patientDetails;

  try {
    const result = await pool.query(
      "INSERT INTO patients (name, age, gender, aadhar_number) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age, gender, aadhar_number]
    );
    return result.rows[0]; 
  } catch (err) {
    console.error("Database error:", err);
    return { error: "Failed to add patient. Please check the details." };
  }
};

module.exports = {
  addPatient,
};
