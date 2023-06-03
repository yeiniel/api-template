import { User, UserModel } from './user';

describe('models/user', () => {
    afterEach(() => jest.restoreAllMocks());

    describe(User.name, () => {
       it('should exist', () => {
           // given
           // when
           // then
           expect(User).toBeDefined();
       }); 
    });

    describe(UserModel.name, () => {
        describe(UserModel.getByEmail.name, () => {
            it('should call findOne with email and return value', () => {
                // given
                const email = `some-id-${Math.floor(Math.random() * 1000)}@server.com`;
                const findOneSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValue(undefined);
                
                // when
                const response = UserModel.getByEmail(email);

                // then
                expect(findOneSpy).toHaveBeenCalledWith({ email });
                expect(findOneSpy.mock.results[0].value).toBe(response);
            });
        });
    });
});