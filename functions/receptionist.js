const pool = require("../config/dbconfig");

const addPatient = async (patientDetails, userRole) => {
  if (userRole !== "receptionist") {
    return {
      error: "Unauthorized: Only receptionists can add patient details.",
    };
  }

  const { name, OPid, age, gender, aadhar_number } = patientDetails;

  try {
    const result = await pool.query(
      "INSERT INTO patients (name, OPid, age, gender, aadhar_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, OPid, age, gender, aadhar_number]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    return { error: "Failed to add patient. Please check the details." };
  }
};

module.exports = {
  addPatient,
};
