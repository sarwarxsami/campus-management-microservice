class User {
  constructor({ id, name, email, username, usertype }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.userType = usertype !== undefined ? Number(usertype) : null;
  }
}

module.exports = User;