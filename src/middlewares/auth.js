import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig.js';

const authMiddlewares = (request, response, next) => {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      error: 'Token não fornecido.',
    });
  }

  // Divide o "Bearer TOKEN" e pega apenas o token
  const [, token] = authToken.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    // Injeta os dados do token na requisição
    request.userId = decoded.id;
    request.userAdmin = decoded.admin;

    return next();
  } catch (error) {
    return response.status(401).json({
      error: 'Token inválido.',
    });
  }
};

export default authMiddlewares;