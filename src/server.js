import app from "./app.js";
import "./database/index.js";

const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (error) => {
  console.error("uncaughtException:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

app.listen(PORT, () => {
  console.log(`🚀 servidor rodando na porta ${PORT}`);
});