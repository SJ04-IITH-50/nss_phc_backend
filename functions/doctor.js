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
      "SELECT name, OPid, age,gender FROM patients WHERE id = $1",
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
    // Update the patient's details in the `patients` table
    const result = await pool.query(
      "UPDATE patients SET complaint = $1, medicines_prescribed = $2, is_prescribed = $3 WHERE id = $4 RETURNING *",
      [complaint, medicines, true, patientId]
    );

    if (result.rows.length === 0) {
      return { error: "Patient not found" };
    }

    // Clear out existing medicines for this patient in `patient_medicines`
    await pool.query("DELETE FROM patient_medicines WHERE patient_id = $1", [
      patientId,
    ]);

    // Insert each new medicine for the patient (assuming medicines is an array)
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
