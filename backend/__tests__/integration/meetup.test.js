import request from 'supertest';
import { format, subDays, addMinutes } from 'date-fns';

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

describe('Meetup', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return a list of ALL meetups', async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .get('/meetup')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should return a list of meetups specific to that day', async () => {
    const token = await fetchUserAuthorization();

    const date = format(new Date(), "dd'-'MM'-'yyyy");

    const response = await request(app)
      .get('/meetup')
      .query({ date })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should find a meetup by id', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetup(token);

    const response = await request(app)
      .get(`/meetup/${meetup.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body).toHaveProperty('id');
  });

  it("shouldn't find a meetup by id, because meetup not found", async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .get(`/meetup/0`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should create meetup', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetup(token);

    expect(meetup).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      location: expect.any(String),
      date: expect.any(String),
    });
  });

  it("shouldn't create meetup, because date is invalid", async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup');

    const uploadedFile = await uploadFile(token);

    const invalidDate = subDays(new Date(), 1);

    const response = await request(app)
      .post('/meetup')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, banner_id: uploadedFile.id, date: invalidDate });

    expect(response.status).toBe(400);
  });

  it("shouldn't create meetup, because request doesn't pass validation", async () => {
    const token = await fetchUserAuthorization();

    // sem o banner_id
    const meetup = await factory.attrs('Meetup');

    const response = await request(app)
      .post('/meetup')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup });

    expect(response.status).toBe(400);
  });

  it('should update meetup', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetup(token);

    // mudando title, description e location apenas
    const response = await request(app)
      .put(`/meetup/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'New title',
      });

    expect(response.body).toHaveProperty('id');
  });

  it("shouldn't update meetup, because time of update availability is expired", async () => {
    const token = await fetchUserAuthorization();
    const uploadedFile = await uploadFile(token);

    const meetupAttrs = await factory.attrs('Meetup');
    const createMeetupResponse = await request(app)
      .post('/meetup')
      .set('Authorization', `bearer ${token}`)
      .send({
        ...meetupAttrs,
        banner_id: uploadedFile.id,
        // data muito próxima para ser editada
        date: addMinutes(new Date(), 5),
      });

    // mudando title, description e location apenas
    const response = await request(app)
      .put(`/meetup/${createMeetupResponse.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        date: subDays(new Date(), 1),
      });

    expect(response.status).toBe(401);
  });

  it("shouldn't update meetup, because meetup not found", async () => {
    const token = await fetchUserAuthorization();

    // mudando title, description e location apenas
    const response = await request(app)
      .put(`/meetup/0`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'New title',
      });

    expect(response.status).toBe(400);
  });

  it("shouldn't update meetup banner, because banner_id doesn't exist", async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetup(token);

    // mudando title, description e location apenas
    const response = await request(app)
      .put(`/meetup/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        banner_id: 0,
      });

    expect(response.status).toBe(400);
  });

  it('should delete meetup', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetup(token);

    const response = await request(app)
      .delete(`/meetup/${meetup.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("shouldn't delete meetup, because meetup doesn't exist", async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .delete(`/meetup/0`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
