const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const DeviceControl = require("./deviceControl.model");

const Device = sequelize.define(
  "Device",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM("led", "fan", "ac"), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);
Device.hasMany(DeviceControl, { foreignKey: "deviceId" });
DeviceControl.belongsTo(Device, { foreignKey: "deviceId", as: "device" });

module.exports = Device;
