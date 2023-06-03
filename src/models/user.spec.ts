import { User, UserModel } from './user';

describe('models/user', () => {
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
            it('should exist', () => {
                // given
                // when
                // then
                expect(User.getByEmail).toBeDefined();
            });
        });
    });
});