import express, { Application } from 'express';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { User, UserModel } from '../../models/user';
import authRouter from '../../routes/auth';
import { hashPassword } from '../../helpers/hash.helper';

describe('routes/auth', () => {
    let app: Application;
    let request: ReturnType<supertest>;

    beforeEach(() => {
        // setup express application instance
        app = express();

        app.use(express.urlencoded({ extended: true }));
        authRouter(app);

        request = supertest(app);

        // setup some envs used by createToken method
        process.env['JWT_SECRET'] = 'some-secret';
        process.env['TOKEN_EXPIRES_IN'] = '1h';
    });

    describe('login', () => {
        let email: User['email'];
        let password: User['password'];
        let user: Omit<User, 'checkPassword'>;

        beforeEach(async () => {
            // setup a valid user account
            email = `user-${Math.floor(Math.random() * 100)}@example.com`;
            password = `some-password-${Math.random()}`;
            user = {
                email,
                name: `Test User ${Math.random()}`,
                role: 1,
                password: hashPassword(password)
            };

            jest.spyOn(UserModel, 'checkCredentials')
                .mockImplementation((e, p) => Promise.resolve(
                    e === email && p === password 
                        ? { email, password, role: 1 } 
                        : false
                ) as never)
        })

        it('should fail if email and password not provided', async () => {
            const res = await request.post('/api/login');

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if email not registered', async () => {
            const res = await request.post('/api/login').type('form').send({
                email: `not-registered@example.com`,
                password
            });

            expect(res.statusCode).toBe(401);
        });

        it('should fail if password not matched', async () => {
            const res = await request.post('/api/login').type('form').send({
                email,
                password: `wrong-password`
            });

            expect(res.statusCode).toBe(401);
        });

        it('should succeed if email and password matches', async () => {
            const res = await request.post('/api/login').type('form').send({
                email,
                password
            });

            expect(res.statusCode).toBe(200);

            const parsedUser = jwt.decode(JSON.parse(res.text).Token);
            
            expect(parsedUser['email']).toEqual(user.email);
            expect(parsedUser['role']).toEqual(user.role);
        });
    });

    afterEach(() => { jest.clearAllMocks() })
});