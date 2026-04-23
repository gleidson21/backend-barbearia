import { Sequelize } from "sequelize";
import databaseconfig from "../config/database.cjs";
import User from "../app/models/User.js";
import Service from '../app/models/Services.js';
import Appointment from "../app/models/Appointment.js";

const models = [User,Service,Appointment];

class Database {
  constructor() {
    this.init();
    this.connectionTest(); // Chamamos o teste de conexão aqui
  }

  init() {
    this.connection = new Sequelize(databaseconfig);
    
    models.map((model) => model.init(this.connection));

    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }

  // Método assíncrono para testar se o banco responde
  async connectionTest() {
    try {
      await this.connection.authenticate();
      console.log("✅ Conexão com o PostgreSQL estabelecida com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao conectar com o banco de dados:", error.message);
    }
  }
}

export default new Database();