const pool = require("../config/dbconfig");

const notifyPharmacistOfUpdatedPrescription = (io, patientDetails) => {
  io.emit("updatedPrescription", patientDetails);
};

const getAllPrescriptions = async (userRole) => {
  if (userRole !== "pharmacist") {
    return { error: "Unauthorized: Only pharmacists can view prescriptions." };
  }

  try {
    const result = await pool.query(
      "SELECT id, name, OPid, age, gender, medicines_prescribed FROM patients WHERE medicines_prescribed IS NOT NULL ORDER BY id DESC"
    );

    return result.rows;
  } catch (err) {
    console.error(err);
    return { error: "Failed to retrieve prescriptions." };
  }
};
const getPatientPrescription = async (patientId, userRole) => {
  if (userRole !== "pharmacist") {
    return { error: "Unauthorized: Only pharmacists can view prescriptions." };
  }

  try {
    const result = await pool.query(
      "SELECT name, OPid, age, gender, complaint, medicines_prescribed FROM patients WHERE id = $1 AND medicines_prescribed IS NOT NULL",
      [patientId]
    );

    if (result.rows.length === 0) {
      return {
        error: "Prescription not found or medicines not yet prescribed.",
      };
    }

    return { prescription: result.rows[0] };
  } catch (err) {
    console.error("Error retrieving prescription details:", err);
    return { error: "Failed to retrieve prescription details." };
  }
};

module.exports = {
  notifyPharmacistOfUpdatedPrescription,
  getAllPrescriptions,
  getPatientPrescription,
};
