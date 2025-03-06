import SensorData from "../models/sensorData.model";
import moment from "moment";
const getAllSensorData = async (req, res, next) => {
  try {
    const {
      humidity,
      temperature,
      light,
      createdAt,
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

    if (humidity) whereClause.humidity = parseFloat(humidity);
    if (temperature) whereClause.temperature = parseFloat(temperature);
    if (light) whereClause.light = parseFloat(light);

    // Xử lý tìm kiếm theo trạng thái bật/tắt

    if (createdAt) {
      const utcTime = moment
        .tz(createdAt, "HH:mm:ss DD-MM-YYYY", "Asia/Ho_Chi_Minh") // Chuyển từ giờ VN
        .format("YYYY-MM-DD HH:mm:ss"); // Format chuẩn cho MySQL
      whereClause.createdAt = utcTime; // Truy vấn theo UTC
    }

    const offset = (page - 1) * limit;

    const { rows: sensorDatas, count } = await SensorData.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formattedRecords = sensorDatas.map((record) => ({
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
const getLatestSensorData = async (req, res, next) => {
  try {
    // const devices = ["ac", "fan", "light"];
    const latestData = await SensorData.findOne({
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
export { getAllSensorData, getLatestSensorData };
