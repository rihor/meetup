import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const page = req.query.page || 1;
    const where = {};

    if (req.query.date) {
      const parsedDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['path', 'url'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async find(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId, {
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'id', 'path', 'url'],
        },
      ],
    });

    // checa se achou algum meetup
    if (meetup === null) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    return res.json(meetup);
  }

  async store(req, res) {
    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({ ...req.body, user_id });
    return res.json(meetup);
  }

  async update(req, res) {
    const { meetupId } = req.params;
    const { banner_id } = req.body;

    // achar a meetup de acordo com o id passado nos parametros
    const meetup = await Meetup.findByPk(meetupId);

    // checa se achou algum meetup
    if (meetup === null) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    // caso um novo banner tenha sido mandado
    if (banner_id || typeof banner_id === 'number') {
      // checa se o banner existe no banco
      const banner = await File.findByPk(banner_id);

      // caso o banner não exista retorna o erro
      if (banner === null) {
        return res.status(400).json({ error: 'This banner does not exist' });
      }
    }

    // checar esse é o dono da meetup
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    // checa se o tempo limite já passou
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(401).json({ error: 'Meetup date invalid.' });
    }

    // checa se a meetup já passou
    if (meetup.past) {
      return res.status(400).json({ error: 'Cannot update past meetups' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const { meetupId } = req.params;

    // acha a meetup correspondente ao id passado
    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(400).json({ error: "This meetup doesn't exist" });
    }

    // checa se quem está deletando possui a meetup
    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You can only delete your own meetup' });
    }

    // checa se a meetup já passou
    if (meetup.past) {
      return res.status(400).json({ error: "You can't delete past meetups" });
    }

    await meetup.destroy();

    return res.json(meetup);
  }
}

export default new MeetupController();
