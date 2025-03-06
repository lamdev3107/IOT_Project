import { mqttClient } from "../config/mqtt";
import Device from "../models/device.model";
import DeviceControl from "../models/deviceControl.model";
import moment from "moment-timezone";

export const controlDevices = async (req, res, next) => {
  try {
    const { led, fan, ac } = req.body;
    // console.log("reqbody", req.body);
    // Kiểm tra dữ liệu đầu vào
    if (led === undefined && fan === undefined && ac === undefined) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    let newDeviceControl = {};

    Object.entries(req.body).forEach(async ([key, value]) => {
      const device = await Device.findOne({ where: { type: key }, raw: true });
      const vietnamTime = moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss");
      newDeviceControl.deviceId = device.id;
      newDeviceControl.status = value == "1" ? true : false;
      newDeviceControl.createdAt = vietnamTime;
      newDeviceControl.updatedAt = vietnamTime;
      await DeviceControl.create(newDeviceControl);

      // Publish dữ liệu qua MQTT
      mqttClient.publish(`device/${device.type}`, `${value}`, {
        qos: 1,
        retain: false,
      });
    });

    return res.status(201).json({ message: "Device control successfull" });
  } catch (error) {
    next(error);
  }
};

export const controlAllDevices = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).json({ message: "Missing parameters" });
    }
    let convertedStatus = status == "1" ? true : false;
    const devices = await Device.findAll({
      raw: true,
    });
    let newDeviceControl = devices.map((item) => {
      return {
        deviceId: item.id,
        status: convertedStatus,
      };
    });
    await DeviceControl.bulkCreate(newDeviceControl);

    // Publish dữ liệu qua MQTT
    mqttClient.publish("device/all", `${status}`, {
      qos: 1,
      retain: false,
    });

    return res.status(201).json({ message: "All Device control successfull" });
  } catch (error) {
    next(error);
  }
};

export const getControlHistory = async (req, res, next) => {
  try {
    const {
      deviceId,
      deviceName,
      createdAt,
      status,
      orderby = "createdAt", // Giá trị mặc định là sắp xếp theo thời gian
      order = "desc", // Giá trị mặc định là giảm dần (mới nhất trước)
      page = 1,
      limit = 10,
    } = req.query;

    // Kiểm tra orderby hợp lệ
    const allowedFields = ["createdAt", "deviceId", "status"];
    const allowedOrders = ["asc", "desc"];
    const orderField = allowedFields.includes(orderby) ? orderby : "createdAt";
    const orderDirection = allowedOrders.includes(order.toLowerCase())
      ? order.toLowerCase()
      : "desc";

    let whereClause = {};
    let whereDevice = {};
    if (deviceName) whereDevice.name = deviceName;
    if (deviceId) whereClause.deviceId = deviceId;

    // Xử lý tìm kiếm theo trạng thái bật/tắt
    if (status !== undefined) {
      const statusBoolean = status.toLowerCase() === "true" ? true : false;
      whereClause.status = statusBoolean;
    }

    if (createdAt) {
      const utcTime = moment
        .tz(createdAt, "HH:mm:ss DD-MM-YYYY", "Asia/Ho_Chi_Minh") // Chuyển từ giờ VN
        .format("YYYY-MM-DD HH:mm:ss"); // Format chuẩn cho MySQL
      whereClause.createdAt = utcTime; // Truy vấn theo UTC
    }

    const offset = (page - 1) * limit;
    let { rows: history, count } = await DeviceControl.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      include: [
        {
          model: Device,
          as: "device",
          where: whereDevice,
          // attributes: ["id, type, name"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      // logging: console.log, // Log SQL để debug
    });
    const formattedRecords = history.map((record) => ({
      ...record.toJSON(),
      createdAt: moment
        .utc(record.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("HH:mm:ss DD-MM-YYYY"),
    }));

    return res.status(200).json({
      data: formattedRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalRecords: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestControlHistory = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const latestData = await DeviceControl.findAll({
      where: { deviceId },
      include: [{ model: Device, as: "device", attributes: ["type", "name"] }],
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "Get latest sensor data successfully",
      data: latestData,
    });
  } catch (err) {
    next(err);
  }
};
