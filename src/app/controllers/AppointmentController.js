import * as Yup from 'yup';
import Appointment from '../models/Appointment.js';
import Service from '../models/Services.js';
import User from '../models/User.js';

function buildLocalDate(dateString) {
  const [datePart, timePart] = String(dateString).split('T');

  if (!datePart || !timePart) {
    return null;
  }

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.slice(0, 5).split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function formatLocalDate(dateValue) {
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      service_id: Yup.string().uuid().required(),
      provider_id: Yup.string().uuid().required(),
      date: Yup.string().required(),
      notes: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const { service_id, provider_id, date, notes } = req.body;

    const hourStart = buildLocalDate(date);

    if (!hourStart || Number.isNaN(hourStart.getTime())) {
      return res.status(400).json({ error: 'Data inválida.' });
    }

    const now = new Date();

    if (hourStart.getTime() <= now.getTime()) {
      return res
        .status(400)
        .json({ error: 'Datas passadas não são permitidas.' });
    }

    const appointmentExists = await Appointment.findOne({
      where: {
        provider_id,
        date: hourStart,
        canceled_at: null,
        finished_at: null,
      },
    });

    if (appointmentExists) {
      return res.status(400).json({ error: 'Horário indisponível.' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      service_id,
      date: hourStart,
      notes,
    });

    return res.status(201).json(appointment);
  }

  async index(req, res) {
    const userRequest = await User.findByPk(req.userId);
    const { provider_id, date } = req.query;

    if (provider_id && date) {
      const appointments = await Appointment.findAll({
        where: {
          provider_id,
          canceled_at: null,
          finished_at: null,
        },
        order: [['date', 'ASC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: User, as: 'provider', attributes: ['id', 'name'] },
          { model: Service, as: 'service', attributes: ['name', 'price'] },
        ],
      });

      const filteredByDate = appointments.filter((appointment) => {
        return formatLocalDate(appointment.date) === date;
      });

      return res.json(filteredByDate);
    }

    const whereCondition = userRequest.admin ? {} : { user_id: req.userId };

    const appointments = await Appointment.findAll({
      where: whereCondition,
      order: [['date', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: User, as: 'provider', attributes: ['id', 'name'] },
        { model: Service, as: 'service', attributes: ['name', 'price'] },
      ],
    });

    return res.json(appointments);
  }

  async finish(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: Service, as: 'service' }],
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Não encontrado.' });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res
        .status(401)
        .json({ error: 'Apenas barbeiros concluem serviços.' });
    }

    if (appointment.canceled_at) {
      return res.status(400).json({ error: 'Está cancelado.' });
    }

    appointment.finished_at = new Date();
    appointment.total_price = appointment.service.price;
    await appointment.save();

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    const user = await User.findByPk(req.userId);

    if (!appointment) {
      return res
        .status(404)
        .json({ error: 'Agendamento não encontrado.' });
    }

    if (appointment.user_id !== req.userId && !user.admin) {
      return res.status(401).json({ error: 'Sem permissão para excluir.' });
    }

    if (appointment.canceled_at !== null || appointment.finished_at !== null) {
      await appointment.destroy();
      return res.json({
        message: 'Registro deletado do banco de dados com sucesso.',
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();