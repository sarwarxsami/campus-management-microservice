const pool = require("../config/db");

const descriptorRepository = {
  // GET /descriptors?description=
  async findAll({ description } = {}) {
    const values = [];
    const where = description
      ? `WHERE description ILIKE $${values.push(`%${description}%`)}`
      : "";

    const sql = `SELECT * FROM "Descriptor" ${where} ORDER BY id`;
    const { rows } = await pool.query(sql, values);
    return rows;
  },
};

module.exports = descriptorRepository;