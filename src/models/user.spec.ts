import { User, UserModel } from './user';

function setAndGetUserAttrTestFactory<T extends keyof User>(attr: T, valueFactory: () => User[T]) {
    return () => {
        // given
        const user = new User();
        const value = valueFactory();

        // when
        user[attr] = value;

        // then
        expect(user[attr]).toBe(value);
    };
}

describe('models/user', () => {
    afterEach(() => jest.restoreAllMocks());

    describe(User.name, () => {
        let user: User;

        beforeEach(() => user = new User());

        it('should provide passwordResetToken',
           setAndGetUserAttrTestFactory('passwordResetToken',
                                        () => `some-token-${Math.floor(Math.random() * 1000)}`));

        it('should provide passwordResetTokenExpires',
           setAndGetUserAttrTestFactory('passwordResetTokenExpires',
                                        () => new Date()));
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
                expect(findOneSpy.mock.results[0].value).toEqual(response);
            });
        });
    });
});