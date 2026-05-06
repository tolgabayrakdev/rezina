import { query } from '../config/db.js';

export class InterestRepository {
  async create({ carId, customerId, userId, note }) {
    const result = await query(
      `INSERT INTO car_interests (car_id, customer_id, note)
       SELECT c.id, cu.id, $4
       FROM cars c
       JOIN customers cu ON cu.id = $2 AND cu.user_id = $3
       WHERE c.id = $1 AND c.user_id = $3
       RETURNING *`,
      [carId, customerId, userId, note ?? null]
    );
    return result.rows[0];
  }

  async findById(id, userId) {
    const result = await query(
      `SELECT
         ci.*,
         c.user_id as car_user_id,
         c.title        as car_title,
         c.brand        as car_brand,
         c.model        as car_model,
         cu.name        as customer_name,
         cu.phone       as customer_phone
       FROM car_interests ci
       JOIN cars c       ON ci.car_id      = c.id
       JOIN customers cu ON ci.customer_id = cu.id
       WHERE ci.id = $1 AND c.user_id = $2 AND cu.user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  }

  async findByUserId(userId, filters = {}) {
    const conditions = ['c.user_id = $1', 'cu.user_id = $1'];
    const values = [userId];
    let idx = 2;

    if (filters.status) {
      conditions.push(`ci.status = $${idx++}`);
      values.push(filters.status);
    }
    if (filters.car_id) {
      conditions.push(`ci.car_id = $${idx++}`);
      values.push(filters.car_id);
    }
    if (filters.customer_id) {
      conditions.push(`ci.customer_id = $${idx++}`);
      values.push(filters.customer_id);
    }

    const result = await query(
      `SELECT
         ci.*,
         c.title  as car_title,
         c.brand  as car_brand,
         c.model  as car_model,
         cu.name  as customer_name,
         cu.phone as customer_phone
       FROM car_interests ci
       JOIN cars c       ON ci.car_id      = c.id
       JOIN customers cu ON ci.customer_id = cu.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY ci.updated_at DESC`,
      values
    );
    return result.rows;
  }

  async update(id, userId, data) {
    const fields = [];
    const values = [id, userId];
    let idx = 3;

    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }
    if (data.note !== undefined) {
      fields.push(`note = $${idx++}`);
      values.push(data.note);
    }

    if (fields.length === 0) return null;

    const result = await query(
      `UPDATE car_interests ci
       SET ${fields.join(', ')}
       FROM cars c, customers cu
       WHERE ci.id = $1
         AND ci.car_id = c.id
         AND ci.customer_id = cu.id
         AND c.user_id = $2
         AND cu.user_id = $2
       RETURNING ci.*`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteById(id, userId) {
    const result = await query(
      `DELETE FROM car_interests ci
       USING cars c, customers cu
       WHERE ci.id = $1
         AND ci.car_id = c.id
         AND ci.customer_id = cu.id
         AND c.user_id = $2
         AND cu.user_id = $2
       RETURNING ci.id`,
      [id, userId]
    );
    return result.rows[0] || null;
  }
}
