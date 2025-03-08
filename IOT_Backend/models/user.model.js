const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    studentId: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    linkGithub: { type: DataTypes.STRING, allowNull: true },
    linkAPIDoc: { type: DataTypes.STRING, allowNull: true },
    linkGithubProject: { type: DataTypes.STRING, allowNull: true },
    linkReport: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: true }
);

module.exports = User;
