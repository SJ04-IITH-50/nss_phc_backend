const pool = require("../config/dbconfig");

const notifyPharmacistOfUpdatedPrescription = (io, patientDetails) => {
  io.emit("updatedPrescription", patientDetails);
};

const getAllPrescriptions = async (userRole, hospitalId) => {
  if (userRole !== "pharmacist") {
    return { error: "Unauthorized: Only pharmacists can view prescriptions." };
  }

  try {
    const result = await pool.query(
      "SELECT id, name, OPid, age, gender, medicines_prescribed, medicines_done FROM patients WHERE hospital_id = $1 AND medicines_prescribed IS NOT NULL ORDER BY id DESC",
      [hospitalId]
    );

    return result.rows;
  } catch (err) {
    console.error(err);
    return { error: "Failed to retrieve prescriptions." };
  }
};

// Get a patient's prescription (hospital-specific)
const getPatientPrescription = async (patientId, userRole, hospitalId) => {
  if (userRole !== "pharmacist") {
    return { error: "Unauthorized: Only pharmacists can view prescriptions." };
  }

  try {
    const result = await pool.query(
      "SELECT name, OPid, age, gender, complaint, medicines_prescribed FROM patients WHERE id = $1 AND hospital_id = $2 AND medicines_prescribed IS NOT NULL",
      [patientId, hospitalId]
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

// Get medicines for a patient (hospital-specific)
const getMedicinesByPatientId = async (patientId, hospitalId) => {
  try {
    const result = await pool.query(
      "SELECT id, medicine_name, medicine_done FROM patient_medicines WHERE patient_id = $1 AND hospital_id = $2",
      [patientId, hospitalId]
    );
    return result.rows;
  } catch (err) {
    console.error("Error retrieving medicines:", err);
    return { error: "Failed to retrieve medicines." };
  }
};

// Update medicine status
const updateMedicineStatus = async (medicineId, doneStatus, hospitalId) => {
  try {
    const result = await pool.query(
      "UPDATE patient_medicines SET medicine_done = $1 WHERE id = $2 AND hospital_id = $3 RETURNING *",
      [doneStatus, medicineId, hospitalId]
    );

    if (result.rows.length === 0) {
      return { error: "Medicine not found." };
    }

    return { medicine: result.rows[0] };
  } catch (err) {
    console.error("Error updating medicine status:", err);
    return { error: "Failed to update medicine status." };
  }
};

// Mark a prescription as done (hospital-specific)
const markPrescriptionAsDone = async (prescriptionId, hospitalId) => {
  try {
    const result = await pool.query(
      "UPDATE patients SET medicines_done = TRUE WHERE id = $1 AND hospital_id = $2 RETURNING *",
      [prescriptionId, hospitalId]
    );

    if (result.rows.length === 0) {
      return { error: "Prescription not found." };
    }

    return { success: true };
  } catch (err) {
    console.error("Error marking prescription as done:", err);
    return { error: "Failed to update prescription status." };
  }
};


module.exports = {
  notifyPharmacistOfUpdatedPrescription,
  getAllPrescriptions,
  getPatientPrescription,
  updateMedicineStatus,
  getMedicinesByPatientId,
  markPrescriptionAsDone,
};
