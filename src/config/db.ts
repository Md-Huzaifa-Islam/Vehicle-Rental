import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.CONNECTION_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const initDb = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY, 
            name TEXT NOT NULL, 
            email TEXT UNIQUE NOT NULL ,
            CONSTRAINT email_checker CHECK (email = LOWER(email)),
            password TEXT NOT NULL,
            CONSTRAINT password_checker CHECK (char_length(password)>=6),
            phone TEXT NOT NULL,
            role TEXT NOT NULL,
            CONSTRAINT check_role CHECK (role IN ('admin','customer'))
            )
        `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type TEXT NOT NULL,
        CONSTRAINT check_vehicle_type CHECK (type IN ('car','bike','van','SUV')),
        registration_number TEXT NOT NULL UNIQUE,
        daily_rent_price INTEGER NOT NULL,
        CONSTRAINT check_vehicle_price CHECK (daily_rent_price > -1),
        availability_status TEXT NOT NULL,
        CONSTRAINT check_vehicle_availability CHECK (availability_status IN ('available', 'booked'))
            );
        `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id),
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
          CONSTRAINT check_bookings_date CHECK (rent_end_date>rent_start_date),
        total_price INTEGER NOT NULL,
          CONSTRAINT check_booking_total CHECK (total_price>-1),
        status TEXT NOT NULL,
          CONSTRAINT check_booking_status CHECK (status in('active','cancelled','returned'))
    );
    `);
};
