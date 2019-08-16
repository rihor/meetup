import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class CreateSubscriptionService {
  async run({ user_id, meetup_id }) {
    const user = await User.findByPk(user_id);

    const meetup = await Meetup.findByPk(meetup_id, { include: [User] });

    // checa se o dono do meetup é quem está tentando se inscrever
    if (meetup.user_id === user_id) {
      throw new Error("You can't subscribe to your own meetup");
    }

    // checa se o meetup já aconteceu
    if (meetup.past) {
      throw new Error("You can't subscribe to past meetups");
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
      String(checkIfDateIsTaken.meetup_id) === meetup_id
    ) {
      throw new Error('You are already subscribed to this meetup');
    }

    // checa se o usuário já tem uma meetup marcada para esse horário
    if (checkIfDateIsTaken) {
      throw new Error('You can not subscribe to two meetups at the same time');
    }

    // cria a inscrição
    const subscription = await Subscription.create({
      user_id,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return subscription;
  }
}

export default new CreateSubscriptionService();
