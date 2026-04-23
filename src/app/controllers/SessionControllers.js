import authconfig from '../../config/authConfig.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import User from '../models/User.js';

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .trim()
          .lowercase()
          .email()
          .required()
          .max(100),

        password: Yup.string()
          .trim()
          .required()
          .min(6)
          .max(50),
      });

      const isValid = await schema.isValid(req.body);

      const emailOrpasswordincorrect = ()=>{
         return res.status(401).json({
          error: 'E-mail ou senha incorreta.',
        });

      }

      // 1. Dados inválidos
      if (!isValid) {
        return emailOrpasswordincorrect()
      }

      const {email,password} = req.body;

      // 2. Usuário não encontrado
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
       return emailOrpasswordincorrect()
      }

      // 3. Senha errada
      const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordMatch) {
       return emailOrpasswordincorrect()
      }
const { id, admin, name } = user.dataValues;

      console.log("DEBUG - ID do Banco:", id); // Olhe se esse ID aparece no terminal agora!

      return res.json({
        user: { id, name, email, admin },
        token: jwt.sign(
          { id, admin }, // Aqui o ID PRECISA estar preenchido
          authconfig.secret,
          { expiresIn: authconfig.expiresIn }
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Erro interno no servidor.',
      });
    }
  }
}

export default new SessionController();