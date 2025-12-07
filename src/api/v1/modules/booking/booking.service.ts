import { pool } from "../../../../config/db";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  startDate: Date,
  endDate: Date,
  total_price: number,
  status: string
) => {
  // Insert booking
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
   VALUES($1, $2, $3, $4, $5, $6) 
   RETURNING id,
             customer_id,
             vehicle_id,
             TO_CHAR(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
             TO_CHAR(rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
             total_price,
             status`,
    [customer_id, vehicle_id, startDate, endDate, total_price, status]
  );

  return result;
};

const getBookings = async () => {
  const result = pool.query(`
    SELECT
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
            'name', u.name,
            'email', u.email
        ) AS customer,
        json_build_object(
            'vehicle_name', v.vehicle_name,
            'registration_number', v.registration_number
        ) AS vehicle
        FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id;
`);
  return result;
};

export const BookingServices = {
  createBooking,
  getBookings,
};
