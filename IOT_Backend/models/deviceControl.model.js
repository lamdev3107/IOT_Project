const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Device = require("./device.model");

const DeviceControl = sequelize.define(
  "DeviceControl",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { tableName: "devicecontrols", timestamps: true }
);

module.exports = DeviceControl;
