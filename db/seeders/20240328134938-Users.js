const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('111Qqq', 10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'admin',
          email: 'admin@gmail.com',
          password: hash,
          role: 'admin',
          isConfirmed: true,
          confirmedLink: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'user',
          email: 'user@gmail.com',
          password: hash,
          role: 'user',
          isConfirmed: false,
          confirmedLink: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
