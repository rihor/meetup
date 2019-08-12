import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id', 'user_id', 'meetup_id'],
      include: [
        {
          model: Meetup,
          where: {
            date: {
              // Op.gt : greater than >
              [Op.gt]: new Date(),
            },
          },
          required: true,
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
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const { meetupId } = req.params;

    const user = await User.findByPk(req.userId);

    const meetup = await Meetup.findByPk(meetupId, { include: [User] });

    // checa se o dono do meetup é quem está tentando se inscrever
    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't subscribe to your own meetup" });
    }

    // checa se o meetup já aconteceu
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "You can't subscribe to past meetups" });
    }

    // busca por meetups no mesmo horario que está tentando marcar
    const checkIfDateIsTaken = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        { model: Meetup, required: true, where: { date: meetup.date } },
      ],
    });

    // checa se o meetup que está tentando se inscrever é o mesmo meetup que foi achado
    if (
      checkIfDateIsTaken &&
      String(checkIfDateIsTaken.meetup_id) === meetupId
    ) {
      return res
        .status(400)
        .json({ error: 'You are already subscribed to this meetup' });
    }

    // checa se o usuário já tem uma meetup marcada para esse horário
    if (checkIfDateIsTaken) {
      return res.status(400).json({
        error: 'You can not subscribe to two meetups at the same time',
      });
    }

    // cria a inscrição
    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const { meetupId } = req.params;

    // pega o usuário que está acessando essa rota
    const user = await User.findByPk(req.userId);

    const meetup = await Meetup.findByPk(meetupId, { include: [User] });

    // checa se o meetup já aconteceu
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "You can't unsubscribe to past meetups" });
    }

    const subscription = await Subscription.findOne({
      where: { user_id: user.id, meetup_id: meetup.id },
    });

    await subscription.destroy();

    return res.status(200).json(subscription);
  }
}

export default new SubscriptionController();
