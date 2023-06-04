import supertest from 'supertest';
import app from '../src/app';

describe('api/register', () => {
  it('should work', async () => {
    // given
    const request = supertest(process.env.API_ENDPOINT);

    // when
    const response = await request.post('/api/register')
      .send({});

    // then
    expect(response.statusCode).toBe(201);
  });
});