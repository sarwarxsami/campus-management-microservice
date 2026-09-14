const pool = require("../config/db");

const descriptorRepository = {
  // GET /descriptors?description=
  async findAll({ description } = {}) {
    const values = [];
    let sql = `SELECT * FROM descriptor`;
    
    if (description) {
      values.push(`%${description}%`);
      sql += ` WHERE description ILIKE $1`;
    }
    
    sql += ` ORDER BY id`;
    const { rows } = await pool.query(sql, values);
    return rows;
  },
};

module.exports = descriptorRepository;