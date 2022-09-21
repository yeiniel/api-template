import { ClientInfo } from "../../models/refresh-token";
import { login } from "../../controllers/auth.controller";

describe('controllers/auth.controller', () => {
    describe('login', () => {
        it('should return something', async () => {
            const result = await login('user@example.com', 'some-password', {} as ClientInfo);
            console.log(result);
            expect(result).toBeDefined();
        });
    });
});