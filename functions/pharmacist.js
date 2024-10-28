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
      "SELECT id, name, OPid, age, gender, medicines_prescribed, medicines_done FROM patients WHERE medicines_prescribed IS NOT NULL ORDER BY id DESC"
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

const getMedicinesByPatientId = async (patientId) => {
  try {
    const result = await pool.query(
      "SELECT id, medicine_name, medicine_done FROM patient_medicines WHERE patient_id = $1",
      [patientId]
    );
    return result.rows;
  } catch (err) {
    console.error("Error retrieving medicines:", err);
    return { error: "Failed to retrieve medicines." };
  }
};
const updateMedicineStatus = async (medicineId, doneStatus) => {
  try {
    const result = await pool.query(
      "UPDATE patient_medicines SET medicine_done = $1 WHERE id = $2 RETURNING *",
      [doneStatus, medicineId]
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

const markPrescriptionAsDone = async (prescriptionId) => {
  try {
    // Update the `medicines_done` field in the `patients` table or `patient_medicines` table
    await pool.query(
      "UPDATE patients SET medicines_done = $1 WHERE id = $2",
      [true, prescriptionId]
    );

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
