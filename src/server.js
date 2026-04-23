import app from "./app.js";
import './database/index.js'
const Port = 3000;
app.listen(Port, () => {
	console.log(`🚀 servidor rodando na port ${Port}`);
});
