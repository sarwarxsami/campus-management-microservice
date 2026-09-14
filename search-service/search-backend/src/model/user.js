class User {
  constructor({ id, name, email, user_name, user_type }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.user_name = user_name;
    this.user_type = user_type !== undefined ? Number(user_type) : null;
  }
}

module.exports = User;