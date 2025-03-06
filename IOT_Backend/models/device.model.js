const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Device = sequelize.define(
  "Device",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM("led", "fan", "ac"), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

module.exports = Device;
