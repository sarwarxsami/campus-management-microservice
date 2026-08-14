const pool = require("../config/db");

const userRepository = {
  // GET /users?name=&email=&user_name=
  async findAll({ name, email, user_name } = {}) {
    const conditions = [];
    const values = [];
    let paramCounter = 1;

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`name ILIKE $${paramCounter++}`);
    }
    if (email) {
      values.push(`%${email}%`);
      conditions.push(`email ILIKE $${paramCounter++}`);
    }
    if (user_name) {
      values.push(`%${user_name}%`);
      conditions.push(`user_name ILIKE $${paramCounter++}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Query BaseUser directly (since we added user_type column)
    const sql = `
      SELECT id, name, email, user_name, user_type
      FROM base_user
      ${where}
      ORDER BY id
    `;
    const { rows } = await pool.query(sql, values);
    return rows;
  },

  // GET /users/students
  async findStudents() {
    const sql = `
      SELECT id, name, email, user_name, user_type
      FROM base_user
      WHERE user_type = 0
      ORDER BY id
    `;
    const { rows } = await pool.query(sql);
    return rows;
  },
};

module.exports = userRepository;