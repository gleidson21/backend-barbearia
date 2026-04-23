import app from "./app.js";
import "./database/index.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 servidor rodando na porta ${PORT}`);
});