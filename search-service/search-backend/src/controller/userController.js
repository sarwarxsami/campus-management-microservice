const userRepository = require("../repository/userRepo");
const User = require("../model/user");

const userController = {
  // GET /users?name=&email=&username=
  async getUsers(req, res) {
    const { name, email, username } = req.query;
    const rows = await userRepository.findAll({ name, email, username });

    return res.json({
      filters: {
        name: name || null,
        email: email || null,
        username: username || null,
      },
      data: rows.map((u) => new User(u)),
    });
  },

  // GET /users/students
  async getStudents(req, res) {
    const rows = await userRepository.findStudents();
    return res.json({ data: rows.map((u) => new User(u)) });
  },
};

module.exports = userController;