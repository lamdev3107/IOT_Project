import Device from "../models/device.model";

export const getAllDevices = async (req, res) => {
  const devices = await Device.findAll();
  res.json(devices);
};
