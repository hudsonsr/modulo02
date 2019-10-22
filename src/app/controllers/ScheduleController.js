import { Op } from 'sequelize';
import { startOfDay, parseISO, endOfDay } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    /**
     * Check if User is a provider
     */
    const chechUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!chechUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    // 2019-10-22 00:00:00
    // 2019-10-22 23:59:59

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointment);
  }
}

export default new ScheduleController();
