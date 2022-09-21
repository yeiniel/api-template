import { ClientInfo } from "../../models/refresh-token";
import { login } from "../../controllers/auth.controller";
import { UserModel } from '../../models/user';

describe('controllers/auth.controller', () => {
    describe('login', () => {
        beforeEach(async () => {
            // mock UserModel methods
            jest.spyOn(UserModel, 'getByEmail')
                .mockImplementation((email) => Promise.resolve({ 
                    email, 
                    password: 'some-password', 
                    toJSON: () => ({ email, password: 'some-password' }) 
                }) as never)
        })

        it('should return something', async () => {
            const result = await login('user@example.com', 'some-password', {} as ClientInfo);
            console.log(result);
            expect(result).toBeDefined();
        });
    });

    afterEach(() => { jest.clearAllMocks() });
});