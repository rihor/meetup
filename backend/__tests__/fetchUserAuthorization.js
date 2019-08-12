import request from 'supertest';

import app from '../src/app';
import factory from './factories';

async function fetchUserAuthorization() {
  const user = await factory.attrs('User');

  // cadastra usuário
  await request(app)
    .post('/users')
    .send(user);

  // loga com o usuário
  const loginResponse = await request(app)
    .post('/sessions')
    .send(user);

  return loginResponse.body.token;
}

export default fetchUserAuthorization;
