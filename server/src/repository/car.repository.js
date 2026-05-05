import { query } from '../config/db.js';
import pool from '../config/db.js';

export class CarRepository {
  // ── Cars ────────────────────────────────────────────────────────────────

  async create({ workspaceId, title, brand, model, year, mileage, price, status, description }) {
    const result = await query(
      `INSERT INTO cars (workspace_id, title, brand, model, year, mileage, price, status, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [workspaceId, title, brand ?? null, model ?? null, year ?? null, mileage ?? null, price ?? null, status ?? 'in_stock', description ?? null]
    );
    return result.rows[0];
  }

  async findById(id) {
    const result = await query(`SELECT * FROM cars WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findByWorkspaceId(workspaceId, filters = {}) {
    const conditions = ['workspace_id = $1'];
    const values = [workspaceId];
    let idx = 2;

    if (filters.status) {
      conditions.push(`status = $${idx++}`);
      values.push(filters.status);
    }
    if (filters.brand) {
      conditions.push(`LOWER(brand) LIKE $${idx++}`);
      values.push(`%${filters.brand.toLowerCase()}%`);
    }
    if (filters.model) {
      conditions.push(`LOWER(model) LIKE $${idx++}`);
      values.push(`%${filters.model.toLowerCase()}%`);
    }

    const result = await query(
      `SELECT * FROM cars WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      values
    );
    return result.rows;
  }

  async update(id, data) {
    const fields = [];
    const values = [id];
    let idx = 2;

    const allowed = ['title', 'brand', 'model', 'year', 'mileage', 'price', 'status', 'description'];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        fields.push(`${key} = $${idx++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return null;

    const result = await query(
      `UPDATE cars SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteById(id) {
    const result = await query(`DELETE FROM cars WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  }

  // ── Images ───────────────────────────────────────────────────────────────

  async findImagesByCarId(carId) {
    const result = await query(
      `SELECT * FROM car_images WHERE car_id = $1 ORDER BY is_cover DESC, created_at ASC`,
      [carId]
    );
    return result.rows;
  }

  async findImageById(id) {
    const result = await query(`SELECT * FROM car_images WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async addImage({ carId, url, isCover }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (isCover) {
        await client.query(
          `UPDATE car_images SET is_cover = FALSE WHERE car_id = $1`,
          [carId]
        );
      }

      const result = await client.query(
        `INSERT INTO car_images (car_id, url, is_cover) VALUES ($1, $2, $3) RETURNING *`,
        [carId, url, isCover ?? false]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async setCover(carId, imageId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE car_images SET is_cover = FALSE WHERE car_id = $1`,
        [carId]
      );

      const result = await client.query(
        `UPDATE car_images SET is_cover = TRUE WHERE id = $1 AND car_id = $2 RETURNING *`,
        [imageId, carId]
      );

      await client.query('COMMIT');
      return result.rows[0] || null;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteImage(id) {
    const result = await query(`DELETE FROM car_images WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  }

  // ── Links ────────────────────────────────────────────────────────────────

  async findLinksByCarId(carId) {
    const result = await query(
      `SELECT * FROM car_links WHERE car_id = $1 ORDER BY created_at ASC`,
      [carId]
    );
    return result.rows;
  }

  async findLinkById(id) {
    const result = await query(`SELECT * FROM car_links WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async addLink({ carId, platform, url }) {
    const result = await query(
      `INSERT INTO car_links (car_id, platform, url) VALUES ($1, $2, $3) RETURNING *`,
      [carId, platform, url]
    );
    return result.rows[0];
  }

  async deleteLink(id) {
    const result = await query(`DELETE FROM car_links WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  }
}
