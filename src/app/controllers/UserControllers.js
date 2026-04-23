import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import User from '../models/User.js';

class UserController {
  // MÉTODO PARA CRIAR USUÁRIO (O QUE VOCÊ JÁ TINHA)
  async store(req, res) {
    const Schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });

    try {
      Schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado.' });
    }

    const password_hash = await bcrypt.hash(password, 8);

    const user = await User.create({
      name,
      email,
      password_hash,
      admin,
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    });
  }

  // NOVO MÉTODO: LISTAR USUÁRIOS (ESSENCIAL PARA O FRONT-END)
  async index(req, res) {
    try {
      // Busca todos os usuários, mas retorna apenas os campos necessários
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'admin'],
      });

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }
}

export default new UserController();