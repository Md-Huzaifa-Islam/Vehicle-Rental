import { pool } from "../../../../config/db";

const CreateVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const GetAllVehicles = async () => {
  const result = await pool.query(`
        SELECT * FROM vehicles
        `);
  return result;
};

const GetAVehicleById = async (vehicleId: number) => {
  const result = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1
        `,
    [vehicleId]
  );
  return result;
};

const UpdateVehicle = async (
  vehicleId: number,
  filteredUpdates: Record<string, any>
) => {
  const fields = Object.keys(filteredUpdates);
  const values = Object.values(filteredUpdates);

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  values.push(vehicleId);

  const result = await pool.query(
    `UPDATE vehicles SET ${setClause} WHERE id = $${values.length} RETURNING *`,
    values
  );

  return result;
};

const DeleteVehicle = async (vehicleId: number) => {
  const result = await pool.query(
    `
        DELETE FROM vehicles WHERE id=$1
        `,
    [vehicleId]
  );
  return result;
};

export const VehicleServices = {
  CreateVehicle,
  GetAllVehicles,
  GetAVehicleById,
  UpdateVehicle,
  DeleteVehicle,
};
