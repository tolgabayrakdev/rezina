import { query } from '../config/db.js';

export class WorkspaceRepository {
  async create({ name, ownerId }) {
    const result = await query(
      `INSERT INTO workspaces (name, owner_id) VALUES ($1, $2)
       RETURNING id, name, owner_id, created_at`,
      [name, ownerId]
    );
    return result.rows[0];
  }

  async findById(id) {
    const result = await query(
      `SELECT w.id, w.name, w.owner_id, w.created_at,
              u.email as owner_email
       FROM workspaces w
       JOIN users u ON w.owner_id = u.id
       WHERE w.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByOwnerId(ownerId) {
    const result = await query(
      `SELECT id, name, owner_id, created_at
       FROM workspaces
       WHERE owner_id = $1
       ORDER BY created_at DESC`,
      [ownerId]
    );
    return result.rows;
  }

  async update(id, { name }) {
    const result = await query(
      `UPDATE workspaces SET name = $2 WHERE id = $1
       RETURNING id, name, owner_id, created_at`,
      [id, name]
    );
    return result.rows[0] || null;
  }

  async deleteById(id) {
    const result = await query(
      `DELETE FROM workspaces WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }
}
