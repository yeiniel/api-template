import { login } from './auth.controller';

describe('controllers/auth.controller', () => {
    describe(login.name, () => {
        it('should promise to return something', async () => {
            // given
            // when
            const response = await login(undefined, undefined, undefined);
            
            // then
            expect(response).toBeDefined();
        });
    });
});