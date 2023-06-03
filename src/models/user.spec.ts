import { User, UserModel } from './user';

describe('models/user', () => {
    afterEach(() => jest.restoreAllMocks());

    describe(User.name, () => {
        let user: User;

        beforeEach(() => user = new User());

        it('should provide passwordResetToken', () => {
            // given
            const token = `some-token-${Math.floor(Math.random() * 1000)}`;

            // when
            user.passwordResetToken = token;

            // then
            expect(user.passwordResetToken).toBe(token);
        });

        it('should provide passwordResetTokenExpires', () => {
            // given
            const tokenExpires = new Date();

            // when
            user.passwordResetTokenExpires = tokenExpires;

            // then
            expect(user.passwordResetTokenExpires).toBe(tokenExpires);
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