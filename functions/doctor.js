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

module.exports = {
  getAllPatients,
  notifyDoctorsOfNewPatient,
};
