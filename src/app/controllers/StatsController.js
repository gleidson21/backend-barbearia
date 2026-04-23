import { startOfMonth, endOfMonth } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment.js';
import Service from '../models/Services.js';

class StatsController {
  async index(req, res) {
    try {
      const { date } = req.query;
      const parsedDate = date ? new Date(date) : new Date();

      const appointments = await Appointment.findAll({
        where: {
          finished_at: {
            [Op.ne]: null,
          },
          // REMOVI o filtro de [Op.between] por um instante para teste. 
          // CUIDADO: No seu INSERT os agendamentos são para MAIO (05), 
          // se você testar em ABRIL (04), vai dar ZERO mesmo!
          date: {
            [Op.between]: [startOfMonth(parsedDate), endOfMonth(parsedDate)],
          },
        },
        // --- ADICIONE ISSO AQUI: ---
        attributes: ['id', 'date', 'finished_at', 'total_price'], 
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['price', 'name'],
          },
        ],
      });

      const totalRevenue = appointments.reduce((acc, apt) => {
        // Garantimos que total_price seja lido. 
        // Se o banco retornar string "35.00", o Number() resolve.
        const price = Number(apt.total_price) || (apt.service ? Number(apt.service.price) : 0);
        return acc + price;
      }, 0);

      const totalCompleted = appointments.length;

      const averageTicket = totalCompleted > 0 
        ? (totalRevenue / totalCompleted).toFixed(2) 
        : "0.00";

      return res.json({
        totalRevenue: totalRevenue.toFixed(2),
        totalCompleted,
        averageTicket,
        month: parsedDate.getMonth() + 1,
      });
    } catch (err) {
      console.log(err); // Importante para você ver o erro real no terminal do VS Code
      return res.status(500).json({ error: 'Erro ao carregar estatísticas.' });
    }
  }
}

export default new StatsController();