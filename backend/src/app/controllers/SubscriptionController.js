import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';
import CreateSubscriptionService from '../services/CreateSubscriptionService';

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

    const subscription = await CreateSubscriptionService.run({
      user_id: req.userId,
      meetup_id: meetupId,
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
