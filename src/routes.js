import { Router } from "express";

// Controllers
import UserControllers from "./app/controllers/UserControllers.js";
import SessionControllers from "./app/controllers/SessionControllers.js";
import ServiceController from "./app/controllers/ServiceController.js";
import AppointmentController from "./app/controllers/AppointmentController.js";
import StatsController from "./app/controllers/StatsController.js"; // Novo

// Middlewares
import authMiddleware from './middlewares/auth.js';
import adminMiddleware from './middlewares/admin.js'; // Novo

const router = new Router();

// --- ROTAS PÚBLICAS ---
router.post('/users', UserControllers.store);
router.post('/session', SessionControllers.store);

// --- TUDO ABAIXO DESTA LINHA EXIGE LOGIN (TOKEN) ---
router.use(authMiddleware);

// Usuários
router.get('/users', UserControllers.index);

// --- ROTAS DE SERVIÇOS ---
router.get('/services', ServiceController.index); // Todos veem
router.post('/services', adminMiddleware, ServiceController.store); // Só Admin
router.put('/services/:id', adminMiddleware, ServiceController.update); // Só Admin
router.delete('/services/:id', adminMiddleware, ServiceController.delete); // Só Admin

// --- ROTAS DE AGENDAMENTOS ---
router.post('/appointments', AppointmentController.store); // Cliente agenda
router.get('/appointments', AppointmentController.index); // Lista (Admin vê tudo / Cliente vê dele)
router.delete('/appointments/:id', AppointmentController.delete); // Cancelar

// ROTA DE CHECK-IN (Marcar como concluído)
// Usamos PATCH porque estamos alterando apenas uma parte do dado (o status de concluído)
router.patch('/appointments/:id/finish', adminMiddleware, AppointmentController.finish);

// --- ROTAS DE ESTATÍSTICAS E FINANCEIRO ---
router.get('/admin/stats', adminMiddleware, StatsController.index);

export default router;