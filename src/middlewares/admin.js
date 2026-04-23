import User from '../app/models/User.js';

async function adminMiddleware(req, res, next) {
  try {
    // 1. Busca o usuário no banco usando o ID que o authMiddleware colocou no req
    const user = await User.findByPk(req.userId);

    // 2. Verifica se o usuário existe e se ele é um administrador
    if (!user || !user.admin) {
      return res.status(401).json({ 
        error: 'Acesso negado. Esta rota é exclusiva para administradores.' 
      });
    }

    // 3. Se for admin, segue para o próximo passo (Controller)
    return next();
    
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao verificar permissões.' });
  }
}

export default adminMiddleware;