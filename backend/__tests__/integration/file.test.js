import truncate from '../util/truncate';
import fetchUserAuthorization from '../fetchUserAuthorization';
import uploadFile from '../uploadFile';

describe('File', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should upload a file', async () => {
    const token = await fetchUserAuthorization();

    const responseBody = await uploadFile(token);

    expect(responseBody).toHaveProperty('url');
  });
});
