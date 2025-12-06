import { pool } from "../../../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
};

const updateUser = async (id: number, updates: Record<string, any>) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  values.push(id);

  const result = await pool.query(
    `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING id, name, email, phone, role`,
    values
  );

  return result;
};

const deleteUser = async (id: number) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
