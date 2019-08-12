import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    // factory gera nome e email aleatórios
    const user = await factory.create('User', {
      // passando uma senha estática para poder comparar depois
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    // response.body = certo
    // response.data = errado, não confunda com axios
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should fail register validation', async () => {
    // contêm email invalido
    const user = { name: 'Usuário de teste', email: 'a', password: '123456' };

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should update user name, email and password', async () => {
    const user = await factory.attrs('User');

    // cadastro
    await request(app)
      .post('/users')
      .send({ ...user, password: '123456' });

    // login
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ ...user, password: '123456' });

    user.token = loginResponse.body.token;

    const updateUserResponse = await request(app)
      .put('/users')
      .send({
        name: 'New Name',
        email: 'teste@nottaken.com',
        oldPassword: '123456',
        password: '123123',
        confirmPassword: '123123',
      })
      .set('Authorization', `bearer ${user.token}`);

    expect(updateUserResponse.body).toHaveProperty('id');
  });

  it("shouldn't update user password, the password doesn't match the user password", async () => {
    const user = await factory.attrs('User');

    // cadastro
    await request(app)
      .post('/users')
      .send({ ...user, password: '123456' });

    // login
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ ...user, password: '123456' });

    user.token = loginResponse.body.token;

    const updateUserResponse = await request(app)
      .put('/users')
      .send({
        oldPassword: 'different',
        password: '123123',
        confirmPassword: '123123',
      })
      .set('Authorization', `bearer ${user.token}`);

    expect(updateUserResponse.status).toBe(401);
  });

  it("shouldn't update user email, email already in use", async () => {
    const user = await factory.attrs('User');

    // cadastro do usuário A
    await request(app)
      .post('/users')
      .send({ ...user, password: '123456' });

    // cadastro de um usuário B com o email que o usuário A vai tentar pegar
    await request(app)
      .post('/users')
      .send({ ...user, email: 'email@taken.com' });

    // login do usuário A
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ ...user, password: '123456' });

    user.token = loginResponse.body.token;

    const updateUserResponse = await request(app)
      .put('/users')
      .send({
        email: 'email@taken.com',
      })
      .set('Authorization', `bearer ${user.token}`);

    expect(updateUserResponse.status).toBe(400);
  });

  it("shouldn't pass update user validation, because it didn't provide a confirmation password", async () => {
    const user = await factory.attrs('User');

    // cadastro
    await request(app)
      .post('/users')
      .send({ ...user, password: '123456' });

    // login
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ ...user, password: '123456' });

    user.token = loginResponse.body.token;

    const updateUserResponse = await request(app)
      .put('/users')
      .send({
        oldPassword: '123456',
        password: 'newPassword',
      })
      .set('Authorization', `bearer ${user.token}`);

    expect(updateUserResponse.status).toBe(400);
  });
});
