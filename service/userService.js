const { User } = require('../db/models');

class UserService {
  async findUserFromEmail(email) {
    try {
      const user = await User.findOne({ where: { email }, raw: true });
      return user;
    } catch (error) {
      throw Error('Database query error');
    }
  }

  async findOrCreate(userEmail, hashPassword) {
    try {
      const [user, created] = await User.findOrCreate({
        where: { email: userEmail },
        defaults: {
          password: hashPassword,
        },
      });
      return [user, created];
    } catch (error) {
      throw Error('Database query error');
    }
  }
}

module.exports = new UserService();
