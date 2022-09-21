import { User, UserModel } from '../../models/user';

describe('models/user', () => {
    describe('User', () => {
        it('should exist', () => {
            expect(User).toBeDefined();
        });
    });

    describe('UserModel', () => {
        describe('getByEmail', () => {
            it('should work', () => {
                const findOneSpy = jest.spyOn(UserModel, 'findOne').mockImplementation(() => Promise.resolve({}) as any);

                const result = UserModel.getByEmail('user@demo.com');

                expect(findOneSpy).toHaveBeenCalledTimes(1);
                expect(findOneSpy.mock.calls[0][0].email).toBe('user@demo.com');
                expect(result).toBe(findOneSpy.mock.results[0].value);
            });
        });
    });
});