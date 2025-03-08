const mqtt = require("mqtt");
const SensorData = require("../models/sensorData.model");

require("dotenv").config();
const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC_SENSOR = process.env.MQTT_TOPIC_SENSOR;

if (!MQTT_BROKER) {
  console.error("❌ Lỗi: MQTT_BROKER chưa được thiết lập trong .env");
  process.exit(1);
}

const options = {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  port: MQTT_PORT,
};

export const mqttClient = mqtt.connect(MQTT_BROKER, options);

mqttClient.on("connect", () => {
  console.log(`🔗 Connected to MQTT Broker at ${MQTT_BROKER}`);
  mqttClient.subscribe(MQTT_TOPIC_SENSOR, (err) => {
    if (!err) console.log(`📡 Subscribed to topic: ${MQTT_TOPIC_SENSOR}`);
  });

  // Gửi tin nhắn kiểm tra
  mqttClient.publish("test/connection", "MQTT Backend is connected!", (err) => {
    if (err) {
      console.error("❌ Failed to publish test message");
    } else {
      console.log("📤 Test message sent to 'test/connection'");
    }
  });
});

mqttClient.on("message", async (topic, message) => {
  // console.log(`📩 Received message on ${topic}: ${message.toString()}`);

  if (topic === "sensor/data") {
    try {
      // const data = JSON.parse(message.toString());
      // await SensorData.create({
      //   sensor: "Cảm biến môi trường",
      //   temperature: data.temp,
      //   humidity: data.humid,
      //   light: data.light,
      // });
      // console.log("Save sensor data to DB");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }
});

// Xử lý lỗi kết nối
mqttClient.on("error", (err) => {
  console.error("❌ MQTT Error:", err.message);
});

// Xử lý khi mất kết nối
mqttClient.on("close", () => {
  console.warn("⚠️ MQTT Connection closed");
});

// Xử lý khi bị mất kết nối tạm thời
mqttClient.on("offline", () => {
  console.warn("⚠️ MQTT Broker is offline");
});

// Xử lý khi bị mất kết nối và đang thử kết nối lại
mqttClient.on("reconnect", () => {
  console.log("🔄 Reconnecting to MQTT Broker...");
});
