const pool = require("../config/db");

const locationRepository = {
  // GET /locations?name=
  async findAll({ name } = {}) {
    const values = [];
    const where = name
      ? `WHERE name ILIKE $${values.push(`%${name}%`)}`
      : "";

    const sql = `SELECT * FROM "Location" ${where} ORDER BY id`;
    const { rows } = await pool.query(sql, values);
    return rows;
  },
};

module.exports = locationRepository;