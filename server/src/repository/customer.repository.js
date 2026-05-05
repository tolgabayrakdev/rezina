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

  async findById(id) {
    const result = await query(`SELECT * FROM customers WHERE id = $1`, [id]);
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

  async update(id, data) {
    const fields = [];
    const values = [id];
    let idx = 2;

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
      `UPDATE customers SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteById(id) {
    const result = await query(`DELETE FROM customers WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  }
}
