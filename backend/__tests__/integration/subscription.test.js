import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';
import fetchUserAuthorization from '../fetchUserAuthorization';
import uploadFile from '../uploadFile';

async function createMeetup(token) {
  const meetup = await factory.attrs('Meetup');

  const uploadedFile = await uploadFile(token);

  const response = await request(app)
    .post('/meetup')
    .set('Authorization', `bearer ${token}`)
    .send({ ...meetup, banner_id: uploadedFile.id });

  return response.body;
}

describe('Subscription', () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should list the user's subscriptions", async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should subscribe the user to a meetup', async () => {
    const token1 = await fetchUserAuthorization();
    const meetup = await createMeetup(token1);

    /**
     * usar o fetchUserAuthorization() para conseguir um segundo token
     * apenas gera o mesmo token
     *  */

    // cadastra usuário2
    await request(app)
      .post('/users')
      .send({ name: 'test', email: 'test@gmail.com', password: '789456' });

    // loga com o usuário2
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ email: 'test@gmail.com', password: '789456' });
    const token2 = loginResponse.body.token;

    const response = await request(app)
      .post(`/meetup/${meetup.id}/subscribe`)
      .set('Authorization', `bearer ${token2}`);

    expect(response.status).toBe(200);
  });

  it("shouldn't subscribe to two meetups at the same time", async () => {
    const token1 = await fetchUserAuthorization();
    const meetup = await createMeetup(token1);
    const meetup2 = await createMeetup(token1);

    // cadastra usuário2
    await request(app)
      .post('/users')
      .send({ name: 'test', email: 'test@gmail.com', password: '789456' });

    // loga com o usuário2
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ email: 'test@gmail.com', password: '789456' });
    const token2 = loginResponse.body.token;

    await request(app)
      .post(`/meetup/${meetup.id}/subscribe`)
      .set('Authorization', `bearer ${token2}`);

    const response = await request(app)
      .post(`/meetup/${meetup2.id}/subscribe`)
      .set('Authorization', `bearer ${token2}`);

    expect(response.status).toBe(500);
  });

  it("shouldn't subscribe to the same meetup twice", async () => {
    const token1 = await fetchUserAuthorization();
    const meetup = await createMeetup(token1);

    /**
     * usar o fetchUserAuthorization() para conseguir um segundo token
     * apenas gera o mesmo token
     *  */

    // cadastra usuário2
    await request(app)
      .post('/users')
      .send({ name: 'test', email: 'test@gmail.com', password: '789456' });

    // login com o usuário2
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ email: 'test@gmail.com', password: '789456' });
    const token2 = loginResponse.body.token;

    await request(app)
      .post(`/meetup/${meetup.id}/subscribe`)
      .set('Authorization', `bearer ${token2}`);

    const response = await request(app)
      .post(`/meetup/${meetup.id}/subscribe`)
      .set('Authorization', `bearer ${token2}`);

    expect(response.status).toBe(500);
  });

  it("shouldn't subscribe to its own meetup", async () => {
    const token1 = await fetchUserAuthorization();
    const meetup = await createMeetup(token1);

    const response = await request(app)
      .post(`/meetup/${meetup.id}/subscribe`)
      .set('Authorization', `bearer ${token1}`);

    expect(response.status).toBe(500);
  });

  it('should unsubscribe the user to a meetup', async () => {
    const token1 = await fetchUserAuthorization();
    const meetup = await createMeetup(token1);

    /**
     * usar o fetchUserAuthorization() para conseguir um segundo token
     * apenas gera o mesmo token
     *  */

    // cadastra usuário2
    await request(app)
      .post('/users')
      .send({ name: 'test', email: 'test@gmail.com', password: '789456' });

    // loga com o usuário2
    const loginResponse = await request(app)
      .post('/sessions')
      .send({ email: 'test@gmail.com', password: '789456' });
    const token2 = loginResponse.body.token;

    // subscribe
    await request(app)
      .post(`/meetup/${meetup.id}/subscribe`)
      .set('Authorization', `bearer ${token2}`);

    // unsubscribe
    const response = await request(app)
      .delete(`/meetup/${meetup.id}/unsubscribe`)
      .set('Authorization', `bearer ${token2}`);

    expect(response.status).toBe(200);
  });
});
