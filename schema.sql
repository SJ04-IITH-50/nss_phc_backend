CREATE TYPE role_type AS ENUM ('doctor', 'pharmacist', 'receptionist');
CREATE TABLE users (
    sno SERIAL PRIMARY KEY,  
    email VARCHAR(255) NOT NULL,
    id UUID DEFAULT gen_random_uuid(), 
    password VARCHAR(255) NOT NULL,
    role role_type NOT NULL
);

CREATE TYPE gender_type AS ENUM('Male', 'Female', 'PNS');
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    OPid VARCHAR(50) UNIQUE NOT NULL,
    age INT CHECK (age > 0),
    gender gender_type NOT NULL,
    aadhar_number CHAR(12) UNIQUE NOT NULL,
    complaint TEXT,
    medicines_prescribed TEXT,
    is_prescribed BOOLEAN DEFAULT FALSE,
    medicines_done BOOLEAN DEFAULT FALSE
);

CREATE TABLE patient_medicines (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    medicine_done BOOLEAN DEFAULT FALSE
);

-- The below table is created to generate OPID which adds the date with the serial number in that particular day
CREATE TABLE daily_opid_counter (
    op_date DATE PRIMARY KEY,
    last_serial INT DEFAULT 0
);


CREATE OR REPLACE FUNCTION generate_opid() RETURNS TRIGGER AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    serial_number INT;
    formatted_serial TEXT;
    new_opid TEXT;
BEGIN

    SELECT last_serial INTO serial_number
    FROM daily_opid_counter
    WHERE op_date = current_date;


    IF NOT FOUND THEN
        serial_number := 1;
        INSERT INTO daily_opid_counter (op_date, last_serial) VALUES (current_date, 1);
    ELSE
        serial_number := serial_number + 1;
        UPDATE daily_opid_counter SET last_serial = serial_number WHERE op_date = current_date;
    END IF;

  
    formatted_serial := LPAD(serial_number::TEXT, 3, '0'); 
    new_opid := TO_CHAR(current_date, 'DD-MM-YYYY') || '-' || formatted_serial;


    NEW.opid := new_opid;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate OPID on patient insert
CREATE TRIGGER auto_generate_opid
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_opid();


