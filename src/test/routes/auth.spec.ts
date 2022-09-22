import express, { Application } from 'express';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { User, UserModel } from '../../models/user';
import authRouter from '../../routes/auth';
import { hashPassword } from '../../helpers/hash.helper';

describe('routes/auth', () => {
    let app: Application;
    let request: ReturnType<supertest>;
    let email: User['email'];
    let password: User['password'];
    let user: Omit<User, 'checkPassword'>;

    beforeEach(() => {
        // setup express application instance
        app = express();

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        authRouter(app);

        request = supertest(app);

        // setup some envs used by createToken method
        process.env['JWT_SECRET'] = 'some-secret';
        process.env['TOKEN_EXPIRES_IN'] = '1h';

        // setup a valid user account
        email = `user-${Math.floor(Math.random() * 100)}@example.com`;
        password = `some-password-${Math.random()}`;
        user = {
            email,
            name: `Test User ${Math.random()}`,
            role: 1,
            password: hashPassword(password)
        };
    });

    describe('login', () => {
        const endpoint = '/api/login';

        beforeEach(async () => {
            jest.spyOn(UserModel, 'checkCredentials')
                .mockImplementation((e, p) => Promise.resolve(
                    e === email && p === password 
                        ? new UserModel(user) 
                        : false
                ) as never)
        });

        it('should fail if email and password not provided', async () => {
            const res = await request.post(endpoint);

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if email not registered', async () => {
            const res = await request.post(endpoint).type('form').send({
                email: `not-registered@example.com`,
                password
            });

            expect(res.statusCode).toBe(401);
        });

        it('should fail if password not matched', async () => {
            const res = await request.post(endpoint).type('form').send({
                email,
                password: `wrong-password`
            });

            expect(res.statusCode).toBe(401);
        });

        it('should succeed if email and password matches', async () => {
            const res = await request.post(endpoint).type('form').send({
                email,
                password
            });

            expect(res.statusCode).toBe(200);

            const decodedToken = jwt.decode(JSON.parse(res.text).token);
            
            expect(decodedToken['sub']).toEqual(user.email);
            expect(decodedToken['role']).toEqual(user.role);
        });
    });

    describe('register', () => {
        const endpoint = '/api/register';

        beforeEach(async () => {
            jest.spyOn(UserModel, 'create')
                .mockImplementation(() => Promise.resolve() as never)
        });

        it('should fail if email, name, role and password not provided', async () => {
            const res = await request.post(endpoint);

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if email not provided', async () => {
            const { email, ...userMinusEmail } = user;

            const res = await request.post(endpoint).type('form').send(userMinusEmail);

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if password not provided', async () => {
            const { password, ...userMinusPassword } = user;

            const res = await request.post(endpoint).type('form').send(userMinusPassword);

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if name not provided', async () => {
            const { name, ...userMinusName } = user;

            const res = await request.post(endpoint).type('form').send(userMinusName);

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should fail if role not provided', async () => {
            const { role, ...userMinusRole } = user;

            const res = await request.post(endpoint).type('form').send(userMinusRole);

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should succeed if all required attributes are provided', async () => {
            const res = await request.post(endpoint).type('form').send(user);

            expect(res.statusCode).toBe(201);
        });
    });

    describe('refresh-token', () => {
        const endpoint = '/api/refresh-token';
        let token: string;

        beforeEach(async () => {
            jest.spyOn(UserModel, 'getByEmail')
                .mockImplementation((e) => Promise.resolve(
                    e === email 
                        ? new UserModel(user) 
                        : false
                ) as never);

            const res = await request.post('/api/login').type('form').send({
                email,
                password
            });

            expect(res.statusCode).toBe(200);

            token = JSON.parse(res.text).token;
        });

        it('should succeed if token provided', async () => {
            const res = await request.post(endpoint).send({
                token
            });

            expect(res.statusCode).toBe(200);

            const response = JSON.parse(res.text);
            const decodedToken = jwt.decode(response.token);
            
            expect(response.userId).toBeDefined();
            expect(decodedToken['sub']).toEqual(user.email);
            expect(decodedToken['role']).toEqual(user.role);
        });
    });

    afterEach(() => { jest.clearAllMocks() })
});