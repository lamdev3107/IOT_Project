import Device from "../models/device.model";
import DeviceControl from "../models/deviceControl.model";

export const getAllDevices = async (req, res) => {
  const devices = await Device.findAll();
  res.json(devices);
};

export const getLatestDeviceStatus = async (req, res, next) => {
  try {
    // Lấy danh sách tất cả thiết bị
    const devices = await Device.findAll({
      include: [
        {
          model: DeviceControl,
          limit: 1, // Chỉ lấy bản ghi mới nhất
          order: [["createdAt", "DESC"]], // Sắp xếp theo thời gian mới nhất
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Get latest device status successfully",
      data: devices,
    });
  } catch (err) {
    next(err);
  }
};
