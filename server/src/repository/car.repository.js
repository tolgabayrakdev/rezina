import { query } from '../config/db.js';
import pool from '../config/db.js';

export class CarRepository {
  // ── Cars ────────────────────────────────────────────────────────────────

  async create({ userId, title, brand, model, year, mileage, price, status, description, fuel_type, transmission, body_type, engine_power, engine_volume, drive_type, color, vehicle_type, insurance_date, inspection_date }) {
    const result = await query(
      `INSERT INTO cars (user_id, title, brand, model, year, mileage, price, status, description, fuel_type, transmission, body_type, engine_power, engine_volume, drive_type, color, vehicle_type, insurance_date, inspection_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       RETURNING *`,
      [
        userId, title,
        brand ?? null, model ?? null, year ?? null, mileage ?? null,
        price ?? null, status ?? 'in_stock', description ?? null,
        fuel_type ?? null, transmission ?? null, body_type ?? null,
        engine_power ?? null, engine_volume ?? null, drive_type ?? null, color ?? null,
        vehicle_type ?? null, insurance_date ?? null, inspection_date ?? null,
      ]
    );
    return result.rows[0];
  }

  async findById(id, userId) {
    const result = await query(`SELECT * FROM cars WHERE id = $1 AND user_id = $2`, [id, userId]);
    return result.rows[0] || null;
  }

  async findByUserId(userId, filters = {}) {
    const conditions = ['user_id = $1'];
    const values = [userId];
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

  async update(id, userId, data) {
    const fields = [];
    const values = [id, userId];
    let idx = 3;

    const allowed = [
      'title', 'brand', 'model', 'year', 'mileage', 'price',
      'status', 'description', 'expertise',
      'fuel_type', 'transmission', 'body_type',
      'engine_power', 'engine_volume', 'drive_type', 'color',
      'vehicle_type', 'insurance_date', 'inspection_date',
    ];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        fields.push(`${key} = $${idx++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return null;

    const result = await query(
      `UPDATE cars SET ${fields.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteById(id, userId) {
    const result = await query(`DELETE FROM cars WHERE id = $1 AND user_id = $2 RETURNING id`, [
      id,
      userId,
    ]);
    return result.rows[0] || null;
  }

  // ── Images ───────────────────────────────────────────────────────────────

  async findImagesByCarId(carId, userId) {
    const result = await query(
      `SELECT ci.*
       FROM car_images ci
       JOIN cars c ON ci.car_id = c.id
       WHERE ci.car_id = $1 AND c.user_id = $2
       ORDER BY ci.is_cover DESC, ci.created_at ASC`,
      [carId, userId]
    );
    return result.rows;
  }

  async findImageById(id, userId) {
    const result = await query(
      `SELECT ci.*
       FROM car_images ci
       JOIN cars c ON ci.car_id = c.id
       WHERE ci.id = $1 AND c.user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  }

  async addImage({ carId, userId, url, publicId, isCover }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (isCover) {
        await client.query(
          `UPDATE car_images ci
           SET is_cover = FALSE
           FROM cars c
           WHERE ci.car_id = c.id AND ci.car_id = $1 AND c.user_id = $2`,
          [carId, userId]
        );
      }

      const result = await client.query(
        `INSERT INTO car_images (car_id, url, public_id, is_cover)
         SELECT id, $3, $4, $5 FROM cars WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [carId, userId, url, publicId, isCover ?? false]
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

  async setCover(carId, userId, imageId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE car_images ci
         SET is_cover = FALSE
         FROM cars c
         WHERE ci.car_id = c.id AND ci.car_id = $1 AND c.user_id = $2`,
        [carId, userId]
      );

      const result = await client.query(
        `UPDATE car_images ci
         SET is_cover = TRUE
         FROM cars c
         WHERE ci.id = $1 AND ci.car_id = $2 AND ci.car_id = c.id AND c.user_id = $3
         RETURNING ci.*`,
        [imageId, carId, userId]
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

  async deleteImage(id, userId) {
    const result = await query(
      `DELETE FROM car_images ci
       USING cars c
       WHERE ci.id = $1 AND ci.car_id = c.id AND c.user_id = $2
       RETURNING ci.id, ci.public_id`,
      [id, userId]
    );
    return result.rows[0] || null;
  }

  // ── Links ────────────────────────────────────────────────────────────────

  async findLinksByCarId(carId, userId) {
    const result = await query(
      `SELECT cl.*
       FROM car_links cl
       JOIN cars c ON cl.car_id = c.id
       WHERE cl.car_id = $1 AND c.user_id = $2
       ORDER BY cl.created_at ASC`,
      [carId, userId]
    );
    return result.rows;
  }

  async findLinkById(id, userId) {
    const result = await query(
      `SELECT cl.*
       FROM car_links cl
       JOIN cars c ON cl.car_id = c.id
       WHERE cl.id = $1 AND c.user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  }

  async addLink({ carId, userId, platform, url }) {
    const result = await query(
      `INSERT INTO car_links (car_id, platform, url)
       SELECT id, $3, $4 FROM cars WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [carId, userId, platform, url]
    );
    return result.rows[0];
  }

  async deleteLink(id, userId) {
    const result = await query(
      `DELETE FROM car_links cl
       USING cars c
       WHERE cl.id = $1 AND cl.car_id = c.id AND c.user_id = $2
       RETURNING cl.id`,
      [id, userId]
    );
    return result.rows[0] || null;
  }

  // ── Maintenance Items ────────────────────────────────────────────────────

  async findMaintenanceItems(carId, userId) {
    const result = await query(
      `SELECT mi.* FROM car_maintenance_items mi
       JOIN cars c ON mi.car_id = c.id
       WHERE mi.car_id = $1 AND c.user_id = $2
       ORDER BY mi.created_at ASC`,
      [carId, userId]
    );
    return result.rows;
  }

  async addMaintenanceItem({ carId, userId, name, interval_km, last_done_mileage, notes }) {
    const result = await query(
      `INSERT INTO car_maintenance_items (car_id, name, interval_km, last_done_mileage, notes)
       SELECT id, $3, $4, $5, $6 FROM cars WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [carId, userId, name, interval_km, last_done_mileage ?? null, notes ?? null]
    );
    return result.rows[0];
  }

  async updateMaintenanceItem(id, carId, userId, data) {
    const fields = [];
    const values = [id, carId, userId];
    let idx = 4;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.interval_km !== undefined) { fields.push(`interval_km = $${idx++}`); values.push(data.interval_km); }
    if (Object.prototype.hasOwnProperty.call(data, 'last_done_mileage')) { fields.push(`last_done_mileage = $${idx++}`); values.push(data.last_done_mileage); }
    if (Object.prototype.hasOwnProperty.call(data, 'notes')) { fields.push(`notes = $${idx++}`); values.push(data.notes); }

    if (fields.length === 0) return null;

    const result = await query(
      `UPDATE car_maintenance_items mi
       SET ${fields.join(', ')}
       FROM cars c
       WHERE mi.id = $1 AND mi.car_id = c.id AND mi.car_id = $2 AND c.user_id = $3
       RETURNING mi.*`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteMaintenanceItem(id, carId, userId) {
    const result = await query(
      `DELETE FROM car_maintenance_items mi
       USING cars c
       WHERE mi.id = $1 AND mi.car_id = c.id AND mi.car_id = $2 AND c.user_id = $3
       RETURNING mi.id`,
      [id, carId, userId]
    );
    return result.rows[0] || null;
  }

  // ── Service Records ──────────────────────────────────────────────────────

  async findServiceRecords(carId, userId) {
    const result = await query(
      `SELECT sr.* FROM car_service_records sr
       JOIN cars c ON sr.car_id = c.id
       WHERE sr.car_id = $1 AND c.user_id = $2
       ORDER BY sr.mileage DESC NULLS LAST, sr.created_at DESC`,
      [carId, userId]
    );
    return result.rows;
  }

  async addServiceRecord({ carId, userId, title, mileage, service_date, notes }) {
    const result = await query(
      `INSERT INTO car_service_records (car_id, title, mileage, service_date, notes)
       SELECT id, $3, $4, $5, $6 FROM cars WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [carId, userId, title, mileage ?? null, service_date ?? null, notes ?? null]
    );
    return result.rows[0];
  }

  async deleteServiceRecord(id, carId, userId) {
    const result = await query(
      `DELETE FROM car_service_records sr
       USING cars c
       WHERE sr.id = $1 AND sr.car_id = c.id AND sr.car_id = $2 AND c.user_id = $3
       RETURNING sr.id`,
      [id, carId, userId]
    );
    return result.rows[0] || null;
  }
}
