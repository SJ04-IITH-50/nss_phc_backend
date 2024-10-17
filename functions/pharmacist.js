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
      "SELECT name, OPid, medicines_prescribed FROM patients WHERE medicines_prescribed IS NOT NULL ORDER BY id DESC"
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    return { error: "Failed to retrieve prescriptions." };
  }
};

module.exports = {
  notifyPharmacistOfUpdatedPrescription,
  getAllPrescriptions,
};
