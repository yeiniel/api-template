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

        describe('getUsers', () => {
            it('should work', () => {
                const paginateSpy = jest.spyOn(UserModel, 'paginate').mockImplementation(() => Promise.resolve({}) as any);

                const query = { email: 'user@demo.com' };
                const result = UserModel.getUsers(0, 10, query);

                expect(paginateSpy).toHaveBeenCalledTimes(1);
                expect(paginateSpy.mock.calls[0][0]).toBe(query);
                expect(paginateSpy.mock.calls[0][1].page).toBe(0);
                expect(paginateSpy.mock.calls[0][1].limit).toBe(10);
                expect(result).toBe(paginateSpy.mock.results[0].value);
            });
        });

        describe('getById', () => {
            it('should work', () => {
                const findByIdSpy = jest.spyOn(UserModel, 'findById').mockImplementation(() => Promise.resolve({}) as any);

                const result = UserModel.getById('some-user-id');

                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy.mock.calls[0][0]).toBe('some-user-id');
                expect(result).toBe(findByIdSpy.mock.results[0].value);
            });
        });

        describe('updateUser', () => {
            it('should work', () => {
                const updateOneSpy = jest.spyOn(UserModel, 'updateOne').mockImplementation(() => Promise.resolve({}) as any);

                const payload = { password: 'new-password' };
                const result = UserModel.updateUser('some-user-id', payload);

                expect(updateOneSpy).toHaveBeenCalledTimes(1);
                expect(updateOneSpy.mock.calls[0][0]._id).toBe('some-user-id');
                expect(updateOneSpy.mock.calls[0][1]).toBe(payload);
                expect(result).toBe(updateOneSpy.mock.results[0].value);
            });
        });

        describe('deleteById', () => {
            it('should work', () => {
                const deleteOneSpy = jest.spyOn(UserModel, 'deleteOne').mockImplementation(() => Promise.resolve({}) as any);

                const result = UserModel.deleteById('some-user-id');

                expect(deleteOneSpy).toHaveBeenCalledTimes(1);
                expect((deleteOneSpy.mock.calls[0][0] as any)._id).toBe('some-user-id');
                expect(result).toBe(deleteOneSpy.mock.results[0].value);
            });
        });

        describe('validateAndCreate', () => {
            it('should work', () => {
                const createSpy = jest.spyOn(UserModel, 'create').mockImplementation(() => Promise.resolve({}) as any);

                const newUser = {
                    "email": "user@example.com",
                    "name": "Name",
                    "role": 1,
                    "password": "some-password"
                };
                const result = UserModel.validateAndCreate(newUser);

                expect(createSpy).toHaveBeenCalledTimes(1);
                expect(createSpy.mock.calls[0][0]).toBe(newUser);
                expect(result).toBe(createSpy.mock.results[0].value);
            });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    })
});