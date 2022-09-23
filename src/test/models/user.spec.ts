import e from 'express';
import { UserModel } from '../../models/user';

describe('models/user', () => {
    describe('UserModel', () => {
        let typegooseModel;
        let userModel: UserModel;

        beforeEach(() => {
            typegooseModel = {
                create: jest.fn((e) => Promise.resolve({
                     ...e, 
                     toJSON: () => e 
                })),
                findOne: jest.fn((e) => Promise.resolve({
                    ...e,
                    toJSON: () => e
                })),
                findById: jest.fn((id) => Promise.resolve({
                    _id: id,
                    toJSON: () => ({ _id: id })
                })),
                deleteOne: jest.fn(() => Promise.resolve({})),
                paginate: jest.fn(() => Promise.resolve({}))
            }

            userModel = new UserModel(undefined, typegooseModel);
        });

        describe('getUserByEmail', () => {
            it('should work', async () => {
                const result = await userModel.getUserByEmail('user@demo.com');

                expect(typegooseModel.findOne).toHaveBeenCalledTimes(1);
                expect(typegooseModel.findOne.mock.calls[0][0].email).toBe('user@demo.com');
                expect(result).toStrictEqual(
                    ( await typegooseModel.findOne.mock.results[0].value).toJSON()
                );
            });
        });

        describe('getUserById', () => {
            it('should work', async () => {
                const result = await userModel.getUserById('some-user-id');

                expect(typegooseModel.findById).toHaveBeenCalledTimes(1);
                expect(typegooseModel.findById.mock.calls[0][0]).toBe('some-user-id');
                expect(result).toStrictEqual(
                    (await typegooseModel.findById.mock.results[0].value).toJSON()
                );
            });
        });

        describe('deleteUserById', () => {
            it('should work', () => {
                const result = userModel.deleteUserById('some-user-id');

                expect(typegooseModel.deleteOne).toHaveBeenCalledTimes(1);
                expect((typegooseModel.deleteOne.mock.calls[0][0] as any)._id).toBe('some-user-id');
                expect(result).toBe(typegooseModel.deleteOne.mock.results[0].value);
            });
        });

        describe('createUser', () => {
            it('should call typegooseModel.create() with user', () => {
                const newUser = {
                    "email": "user@example.com",
                    "name": "Name",
                    "role": 1,
                    "password": "some-password"
                };
                const result = userModel.createUser(newUser);

                expect(typegooseModel.create).toHaveBeenCalledTimes(1);
                expect(typegooseModel.create.mock.calls[0][0]).toBe(newUser);
            });
        });

        describe('getUsers', () => {
            it('should work', () => {
                const query = { email: 'user@demo.com' };
                const result = userModel.getUsers(0, 10, query);

                expect(typegooseModel.paginate).toHaveBeenCalledTimes(1);
                expect(typegooseModel.paginate.mock.calls[0][0]).toBe(query);
                expect(typegooseModel.paginate.mock.calls[0][1].page).toBe(0);
                expect(typegooseModel.paginate.mock.calls[0][1].limit).toBe(10);
                expect(result).toBe(typegooseModel.paginate.mock.results[0].value);
            });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});