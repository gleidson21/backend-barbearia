import express from "express";
import routes from "./routes.js"; // Importa o arquivo que acabamos de criar
import "./database/index.js";    // Importa a sua conexão com o banco (Database)
import cors from 'cors'
class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    // Permite que a API entenda requisições no formato JSON
    this.app.use(express.json());
  }

  routes() {
    // Avisa ao servidor para usar as rotas configuradas
    this.app.use(routes);
  }
}

export default new App().app;