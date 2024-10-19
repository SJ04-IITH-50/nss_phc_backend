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

