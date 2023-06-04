import express from 'express';
import supertest from 'supertest';
import setupRoute from './auth';
import * as authController from '../controllers/auth.controller';

describe('routes/auth', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('/register', () => {
    it('should call register with payload and return 201 if user is registered', async () => {
      // given
      const app = express();
      const request = supertest(app);
      setupRoute(app);
      jest.spyOn(authController, 'register').mockResolvedValue({ exists: false } as never);

      // when
      const response = await request.post('/api/register').send({})

      // then
      expect(response.statusCode).toBe(201);
    });

    it('should call register with payload and return 403 if user already exists', async () => {
      // given
      const app = express();
      const request = supertest(app);
      setupRoute(app);
      jest.spyOn(authController, 'register').mockResolvedValue({ exists: true } as never);

      // when
      const response = await request.post('/api/register').send({})

      // then
      expect(response.statusCode).toBe(403);
    });

    it('should call register with payload and return 204 if falsy', async () => {
      // given
      const app = express();
      const request = supertest(app);
      setupRoute(app);
      jest.spyOn(authController, 'register').mockResolvedValue(null as never);

      // when
      const response = await request.post('/api/register').send({})

      // then
      expect(response.statusCode).toBe(204);
    });

    it('should call register with payload and return 500 if rejected', async () => {
      // given
      const app = express();
      const request = supertest(app);
      setupRoute(app);
      jest.spyOn(authController, 'register').mockRejectedValue(new Error('some error'));

      // when
      const response = await request.post('/api/register').send({})

      // then
      expect(response.statusCode).toBe(500);
    });
  });
});