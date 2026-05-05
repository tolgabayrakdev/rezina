import { query } from '../config/db.js';

export class InterestRepository {
  async create({ carId, customerId, note }) {
    const result = await query(
      `INSERT INTO car_interests (car_id, customer_id, note)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [carId, customerId, note ?? null]
    );
    return result.rows[0];
  }

  async findById(id) {
    const result = await query(
      `SELECT
         ci.*,
         c.workspace_id as car_workspace_id,
         c.title        as car_title,
         c.brand        as car_brand,
         c.model        as car_model,
         cu.name        as customer_name,
         cu.phone       as customer_phone
       FROM car_interests ci
       JOIN cars c       ON ci.car_id      = c.id
       JOIN customers cu ON ci.customer_id = cu.id
       WHERE ci.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByWorkspaceId(workspaceId, filters = {}) {
    const conditions = ['c.workspace_id = $1'];
    const values = [workspaceId];
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

  async update(id, data) {
    const fields = [];
    const values = [id];
    let idx = 2;

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
      `UPDATE car_interests SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteById(id) {
    const result = await query(`DELETE FROM car_interests WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  }
}
