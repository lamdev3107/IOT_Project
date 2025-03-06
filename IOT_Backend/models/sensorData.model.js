const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SensorData = sequelize.define(
  "SensorData",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sensor: { type: DataTypes.STRING },
    temperature: { type: DataTypes.FLOAT, allowNull: false },
    humidity: { type: DataTypes.FLOAT, allowNull: false },
    light: { type: DataTypes.FLOAT, allowNull: false },
  },
  { tableName: "sensordatas", timestamps: true }
);

module.exports = SensorData;
