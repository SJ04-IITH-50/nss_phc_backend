const pool = require("../config/dbconfig");

const notifyDoctorsOfNewPatient = (io, patientDetails) => {
  io.emit("newPatient", patientDetails);
};

const getAllPatients = async (userRole, hospitalId) => {
  if (userRole !== "doctor") {
    return { error: "Unauthorized: Only doctors can view patient details." };
  }

  try {
    const result = await pool.query(
      "SELECT * FROM patients WHERE hospital_id = $1 ORDER BY id DESC",
      [hospitalId]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    return { error: "Failed to retrieve patients." };
  }
};

const getPatientById = async (patientId, hospitalId) => {
  try {
    const result = await pool.query(
      "SELECT name, OPid, age, gender FROM patients WHERE id = $1 AND hospital_id = $2",
      [patientId, hospitalId]
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

const updatePatientDetails = async (patientId, complaint, medicines, hospitalId) => {
  try {
    const result = await pool.query(
      "UPDATE patients SET complaint = $1, medicines_prescribed = $2, is_prescribed = $3 WHERE id = $4 AND hospital_id = $5 RETURNING *",
      [complaint, medicines, true, patientId, hospitalId]
    );

    if (result.rows.length === 0) {
      return { error: "Patient not found" };
    }

    await pool.query("DELETE FROM patient_medicines WHERE patient_id = $1", [patientId]);

    for (const medicine of medicines) {
      await pool.query(
        "INSERT INTO patient_medicines (patient_id, medicine_name, medicine_done) VALUES ($1, $2, $3)",
        [patientId, medicine, false]
      );
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
