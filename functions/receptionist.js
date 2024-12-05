const pool = require("../config/dbconfig");

const addPatient = async (patientDetails, userRole) => {
  const { name, age, gender, aadhar_number, hospital_id } = patientDetails;

  if (userRole !== "receptionist") {
    return { error: "Unauthorized: Only receptionists can add patients." };
  }

  try {
    const result = await pool.query(
      "INSERT INTO patients (name, age, gender, aadhar_number, hospital_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, age, gender, aadhar_number, hospital_id]
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
