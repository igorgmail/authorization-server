const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate({ Project, UsersProject, Task, UsersTask, Comment }) {
    //   User.hasMany(Project, { foreignKey: 'author' });
    //   User.belongsToMany(Project, {
    //     through: UsersProject,
    //     foreignKey: 'junior_id',
    //     otherKey: 'project_id',
    //   });
    //   User.hasMany(UsersProject, { foreignKey: 'junior_id' });
    //   User.hasMany(UsersTask, { foreignKey: 'junior_id' });
    //   User.belongsToMany(Task, {
    //     through: Comment,
    //     foreignKey: 'UserId',
    //     otherKey: 'task_id',
    //   });
    //   User.hasMany(Comment, { foreingKey: 'UserId' });
    //   User.hasMany(Task, { foreignKey: 'author_id' });
    // }
  }

  const attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'user',
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    confirmedLink: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  };

  const options = {
    sequelize,
    modelName: 'User',
    // timestamps: false,
  };

  User.init(attributes, options);
  return User;
};
