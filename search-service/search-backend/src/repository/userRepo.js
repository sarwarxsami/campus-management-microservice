const pool = require("../config/db");

const userRepository = {
  // GET /users?name=&email=&username=
  async findAll({ name, email, username } = {}) {
    const conditions = [];
    const values = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }
    if (email) {
      values.push(`%${email}%`);
      conditions.push(`email ILIKE $${values.length}`);
    }
    if (username) {
      values.push(`%${username}%`);
      conditions.push(`username ILIKE $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Query BaseUser directly (since we added userType column)
    const sql = `
      SELECT id, name, email, username, "userType"
      FROM "BaseUser"
      ${where}
      ORDER BY id
    `;
    const { rows } = await pool.query(sql, values);
    return rows;
  },

  // GET /users/students
  async findStudents() {
    const sql = `
      SELECT id, name, email, username, "userType"
      FROM "BaseUser"
      WHERE "userType" = 0
      ORDER BY id
    `;
    const { rows } = await pool.query(sql);
    return rows;
  },
};

module.exports = userRepository;