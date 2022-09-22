import { ClientInfo } from "../../models/refresh-token";
import { login } from "../../controllers/auth.controller";
import { User, UserModel } from '../../models/user';

describe('controllers/auth.controller', () => {
    describe('login', () => {
        let email: User['email'];
        let password: User['password'];

        beforeEach(async () => {
            email = `user-${Math.floor(Math.random() * 100)}@example.com`;
            password = `some-password-${Math.random()}`;

            // setup some envs used by createToken method
            process.env['JWT_SECRET'] = 'some-secret';
            process.env['TOKEN_EXPIRES_IN'] = '1h';

            // mock UserModel methods
            jest.spyOn(UserModel, 'checkCredentials')
                .mockImplementation((e, p) => Promise.resolve(
                    e === email && p === password 
                        ? { email, password, role: 1 } 
                        : false
                ) as never)
        })

        it('should return something', async () => {
            const result = await login(email, password, {} as ClientInfo);
            expect(result).toBeDefined();
        });
    });

    afterEach(() => { jest.clearAllMocks() });
});