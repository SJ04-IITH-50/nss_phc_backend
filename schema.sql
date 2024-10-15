CREATE TABLE users (
    sno SERIAL PRIMARY KEY,  
    email VARCHAR(255) NOT NULL,
    id UUID DEFAULT gen_random_uuid(), 
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('doctor', 'pharmacist', 'receptionist')) 
);
