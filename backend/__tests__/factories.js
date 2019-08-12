import faker from 'faker';
import { factory } from 'factory-girl';
import { addDays, setMinutes } from 'date-fns';

import User from '../src/app/models/User';
import Meetup from '../src/app/models/Meetup';

factory.define('User', User, {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

// o banner_id deve ser colocado manualmente
factory.define('Meetup', Meetup, {
  title: faker.lorem.words(2),
  description: faker.lorem.sentences(2),
  location: faker.address.streetAddress(),
  date: addDays(setMinutes(new Date(), 30), 1),
  // banner_id
});

export default factory;
