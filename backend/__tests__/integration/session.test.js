import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to login', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/sessions')
      .send(user);

    expect(response.body).toHaveProperty('token');
  });

  it('should not login, because password is different', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    // tentar login com uma senha diferente
    const response = await request(app)
      .post('/sessions')
      .send({ ...user, password: 'O1A_m3u_n0m3_eh_t3st3' });

    expect(response.status).toBe(401);
  });

  it('should not login, because email not found', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    // tentar login com um email não cadastrado
    const response = await request(app)
      .post('/sessions')
      .send({ ...user, email: 'umt3st3@t3st3.com' });

    expect(response.status).toBe(401);
  });

  it('should not pass login validation', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    // tentar login com uma senha invalida
    const response = await request(app)
      .post('/sessions')
      .send({ ...user, email: '0' });

    expect(response.status).toBe(400);
  });
});
