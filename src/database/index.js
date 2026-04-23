import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.cjs";
import User from "../app/models/User.js";
import Service from "../app/models/Services.js";
import Appointment from "../app/models/Appointment.js";

const models = [User, Service, Appointment];

class Database {
  constructor() {
    this.init();
    this.connectionTest();
  }

  init() {
    this.connection = databaseConfig.use_env_variable
      ? new Sequelize(
          process.env[databaseConfig.use_env_variable],
          databaseConfig
        )
      : new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));

    models.map(
      (model) =>
        model.associate &&
        model.associate(this.connection.models)
    );
  }

  async connectionTest() {
    try {
      await this.connection.authenticate();
      console.log("✅ Conexão com PostgreSQL ok");
    } catch (error) {
      console.error("❌ Erro banco:", error);
    }
  }
}

export default new Database();