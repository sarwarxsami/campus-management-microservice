const pool = require("../config/db");

const resourceRepository = {
  // GET /resources  &  GET /resources?name=&type=&location_id=
  async findAll({ name, type, location_id } = {}) {
    const conditions = [];
    const values = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`r.name ILIKE $${values.length}`);
    }
    if (type) {
      values.push(`%${type}%`);
      conditions.push(`r.type ILIKE $${values.length}`);
    }
    if (location_id) {
      values.push(Number(location_id));
      conditions.push(`r.location_id = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM "Resource" r ${where} ORDER BY r.id`;
    const { rows } = await pool.query(sql, values);
    return rows;
  },

  // GET /resources/location/:locationId
  async findByLocation(locationId) {
    const resourceSql = `
      SELECT r.* FROM "Resource" r
      WHERE r.location_id = $1
      ORDER BY r.id
    `;
    const locationSql = `SELECT * FROM "Location" WHERE id = $1`;

    const [resourceResult, locationResult] = await Promise.all([
      pool.query(resourceSql, [locationId]),
      pool.query(locationSql, [locationId]),
    ]);

    return {
      location: locationResult.rows[0] || null,
      resources: resourceResult.rows,
    };
  },

  // GET /resources/type/:type
  async findByType(type) {
    const sql = `
      SELECT * FROM "Resource"
      WHERE type ILIKE $1
      ORDER BY id
    `;
    const { rows } = await pool.query(sql, [`%${type}%`]);
    return rows;
  },

  // GET /resources/descriptors?resource_id=&descriptor_id=
  async findDescriptors({ resource_id, descriptor_id } = {}) {
    const conditions = [];
    const values = [];

    if (resource_id) {
      values.push(Number(resource_id));
      conditions.push(`rd.resource_id = $${values.length}`);
    }
    if (descriptor_id) {
      values.push(Number(descriptor_id));
      conditions.push(`rd.descriptor_id = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT rd.resource_id, r.name AS resource_name,
             rd.descriptor_id, d.description
      FROM "Resource-Descriptor" rd
      JOIN "Resource" r    ON r.id = rd.resource_id
      JOIN "Descriptor" d  ON d.id = rd.descriptor_id
      ${where}
      ORDER BY rd.resource_id, rd.descriptor_id
    `;
    const { rows } = await pool.query(sql, values);
    return rows;
  },

  // GET /resources/available?start=&duration=&location_id=
  async findAvailable({ start, duration, location_id }) {
    const values = [start, Number(duration)];
    const locationFilter = location_id
      ? `AND r.location_id = $${values.push(Number(location_id))}`
      : "";

    // Exclude resources that have a conflicting PENDING(0) or CONFIRMED(1) reservation
    const sql = `
      SELECT r.* FROM "Resource" r
      WHERE r.available = true
        ${locationFilter}
        AND r.id NOT IN (
          SELECT res.resource_id FROM "Reservation" res
          WHERE res."currentState" IN (0, 1)
            AND res.start < ($1::timestamp + ($2 || ' minutes')::interval)
            AND (res.start + (res.duration || ' minutes')::interval) > $1::timestamp
        )
      ORDER BY r.id
    `;
    const { rows } = await pool.query(sql, values);
    return rows;
  },

  // GET /resources/:resourceId/reservations
  async findReservationsByResource(resourceId) {
    const resourceSql = `SELECT id FROM "Resource" WHERE id = $1`;
    const reservationSql = `
      SELECT user_id, start, duration, "currentState"
      FROM "Reservation"
      WHERE resource_id = $1
      ORDER BY start
    `;
    const [resourceResult, reservationResult] = await Promise.all([
      pool.query(resourceSql, [resourceId]),
      pool.query(reservationSql, [resourceId]),
    ]);

    return {
      exists: resourceResult.rows.length > 0,
      reservations: reservationResult.rows,
    };
  },
};

module.exports = resourceRepository;