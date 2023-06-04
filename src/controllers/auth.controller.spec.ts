import { login, register } from './auth.controller';
import { UserModel } from '../models/user';

describe('controllers/auth.controller', () => {
    afterEach(() => jest.restoreAllMocks());

    describe(login.name, () => {
        it('should promise to return something', async () => {
            // given
            // when
            const response = await login(undefined, undefined, undefined);
            
            // then
            expect(response).toBeDefined();
        });
    });

    describe(register.name, () => {
        it('should call UserModel.add and return result', () => {
            // given
            const input = {};
            const addSpy = jest.spyOn(UserModel, 'add').mockResolvedValue(undefined);

            // when
            const response = register(input);

            // then
            expect(addSpy).toHaveBeenCalledWith(input);
            expect(addSpy.mock.results[0].value).toEqual(response);
        });

        it('should call UserModel.add and return { exist } if duplicate key', async () => {
            // given
            const input = {};
            const addSpy = jest.spyOn(UserModel, 'add')
              .mockRejectedValue({ message: 'duplicate key error collection' });

            // when
            const response = await register(input);

            // then
            expect(addSpy).toHaveBeenCalledWith(input);
            expect(response).toEqual({ exist: true });
        });

        it('should call UserModel.add and return null if other error', async () => {
            // given
            const input = {};
            const addSpy = jest.spyOn(UserModel, 'add')
              .mockRejectedValue({ message: 'some error' });

            // when
            const response = await register(input);

            // then
            expect(addSpy).toHaveBeenCalledWith(input);
            expect(response).toEqual(null);
        });
    });
});