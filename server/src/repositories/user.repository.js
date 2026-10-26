const User = require("../models/user.model");

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email }).select("+passwordHash");
  }

  async create(userData) {
    return User.create(userData);
  }
}

module.exports = new UserRepository();
