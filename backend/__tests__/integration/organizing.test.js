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

describe('Organizing', () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should list the owner's meetups", async () => {
    const token = await fetchUserAuthorization();

    await createMeetup(token);
    await createMeetup(token);

    const response = await request(app)
      .get('/organizing')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
