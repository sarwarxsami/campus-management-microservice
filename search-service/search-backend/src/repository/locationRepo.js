const pool = require("../config/db");

const locationRepository = {
  // GET /locations?name=
  async findAll({ name } = {}) {
    const values = [];
    let sql = `SELECT * FROM location`;
    
    if (name) {
      values.push(`%${name}%`);
      sql += ` WHERE name ILIKE $1`;
    }
    
    sql += ` ORDER BY id`;
    const { rows } = await pool.query(sql, values);
    return rows;
  },
};

module.exports = locationRepository;