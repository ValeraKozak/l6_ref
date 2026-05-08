const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  appHost: process.env.APP_HOST || "127.0.0.1",
  appPort: Number(process.env.APP_PORT || 8000),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://app_user:app_password@localhost:5432/app_db",
  nodeEnv: process.env.NODE_ENV || "development"
};

module.exports = { config };
