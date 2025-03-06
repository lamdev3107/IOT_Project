const { Sequelize } = require("sequelize");
require("dotenv").config();

// Option 3: Passing parameters separately (other dialects)
export const sequelize = new Sequelize(process.env.DATABASE, "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDatabase;
