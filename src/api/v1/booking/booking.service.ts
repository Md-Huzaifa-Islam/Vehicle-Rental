import { pool } from "../../../config/db";

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

const getBookings = async (isAdmin: Boolean, userId: Number) => {
  if (isAdmin) {
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
  } else {
    const result = await pool.query(
      `
    SELECT
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
            'vehicle_name', v.vehicle_name,
            'registration_number', v.registration_number,
            'type', v.type
        ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1;
`,
      [userId]
    );

    return result;
  }
};

const getBookingsForUser = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT * FROM bookings WHERE customer_id=$1 and  status='active'
    `,
    [userId]
  );
  return result;
};

const getBookingsForVehicles = async (vehicle_id: number) => {
  const result = await pool.query(
    `
    SELECT * FROM bookings WHERE vehicle_id=$1 and  status='active'
    `,
    [vehicle_id]
  );
  return result;
};

const getBookingById = async (bookingId: number) => {
  const result = await pool.query(
    `
    SELECT * FROM bookings WHERE id=$1
    `,
    [bookingId]
  );
  return result;
};

const updateBooking = async (bookingId: number, status: string) => {
  const result = await pool.query(
    `
    UPDATE bookings 
    SET status=$1 
    WHERE id=$2 
    RETURNING id,
              customer_id,
              vehicle_id,
              TO_CHAR(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
              TO_CHAR(rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
              total_price,
              status
    `,
    [status, bookingId]
  );
  return result;
};

export const BookingServices = {
  createBooking,
  getBookings,
  getBookingsForUser,
  getBookingsForVehicles,
  getBookingById,
  updateBooking,
};
