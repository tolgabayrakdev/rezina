import { query } from '../config/db.js';

export class CustomerRepository {
  async create({ userId, name, phone }) {
    const result = await query(
      `INSERT INTO customers (user_id, name, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, name ?? null, phone ?? null]
    );
    return result.rows[0];
  }

  async findById(id, userId) {
    const result = await query(`SELECT * FROM customers WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ]);
    return result.rows[0] || null;
  }

  async findByUserId(userId, search) {
    const conditions = ['user_id = $1'];
    const values = [userId];

    if (search) {
      conditions.push(`(LOWER(name) LIKE $2 OR phone LIKE $2)`);
      values.push(`%${search.toLowerCase()}%`);
    }

    const result = await query(
      `SELECT * FROM customers WHERE ${conditions.join(' AND ')} ORDER BY name ASC`,
      values
    );
    return result.rows;
  }

  async update(id, userId, data) {
    const fields = [];
    const values = [id, userId];
    let idx = 3;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      values.push(data.phone);
    }

    if (fields.length === 0) return null;

    const result = await query(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteById(id, userId) {
    const result = await query(
      `DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rows[0] || null;
  }
}
