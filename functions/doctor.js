const pool = require("../config/dbconfig");

const notifyDoctorsOfNewPatient = (io, patientDetails) => {
  io.emit("newPatient", patientDetails);
};

const getAllPatients = async (userRole) => {
  if (userRole !== "doctor") {
    return { error: "Unauthorized: Only doctors can view patient details." };
  }

  try {
    const result = await pool.query("SELECT * FROM patients ORDER BY id DESC");
    return result.rows;
  } catch (err) {
    console.error(err);
    return { error: "Failed to retrieve patients." };
  }
};
const getPatientById = async (patientId) => {
  try {
    const result = await pool.query(
      "SELECT name, OPid, age FROM patients WHERE id = $1",
      [patientId]
    );

    if (result.rows.length === 0) {
      return { error: "Patient not found" };
    }

    return { patient: result.rows[0] };
  } catch (err) {
    console.error("Error retrieving patient details:", err);
    return { error: "Failed to retrieve patient details" };
  }
};
const updatePatientDetails = async (patientId, complaint, medicines) => {
  try {
    const result = await pool.query(
      "UPDATE patients SET complaint = $1, medicines_prescribed = $2 WHERE id = $3 RETURNING *",
      [complaint, medicines, patientId]
    );

    if (result.rows.length === 0) {
      return { error: "Patient not found" };
    }

    return { patient: result.rows[0] };
  } catch (err) {
    console.error("Error updating patient details:", err);
    return { error: "Failed to update patient details" };
  }
};
module.exports = {
  getAllPatients,
  notifyDoctorsOfNewPatient,
  getPatientById,
  updatePatientDetails,
};
