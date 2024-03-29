const { sequelize } = require('./models');

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database successfully connected.');
  } catch (error) {
    console.error('---The base is not connected !!!.', error.message);
  }
};
