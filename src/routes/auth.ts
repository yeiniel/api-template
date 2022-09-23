import { Application, Request, Router, Response, NextFunction } from 'express';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { RegisterController } from '../controllers/auth/register.controller';
import { LoginController } from '../controllers/auth/login.controller';
import { RefreshTokenController } from '../controllers/auth/refresh-token.controller';
import { ValidateTokenController } from '../controllers/auth/validate-token.controller';

export default (app: Application) => {
  const router = Router();

  // Mount route as "/api/app"
  app.use('/api', router);

  // inject the application wide userModel if any
  (new LoginController(app.get('userModel')))
    .setupRoute(router.route('/login'));

  // inject the application wide userModel if any
  (new RegisterController(app.get('userModel')))
    .setupRoute(router.route('/register'));

  // inject the application wide userModel if any
  (new RefreshTokenController(app.get('userModel')))
    .setupRoute(router.route('/refresh-token'));
  
  // inject the application wide userModel if any
  (new ValidateTokenController(app.get('userModel')))
    .setupRoute(router.route('/validate-token'));
  
  router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: any = await forgotPassword(req.body.email);
      if (response && response['success'] == true) {
        return res.status(200).json({
          success: true,
          message: 'A link to reset password was sent to the email',
        });
      }
    } catch (error) {
      return next(error);
    }
  });

  router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = String(req.body.token);
      const email: string = String(req.body.email);
      const password: string = String(req.body.password);
      const response: any = await resetPassword(email, password, token);
      if (response && response['success'] == true) {
        return res.status(200).json({
          success: true,
          message:
            'Your password was updated succesfully. Now you can login with your new password',
        });
      }
      if (response && !response.exists) {
        return res.status(403).json({ success: false });
      }
    } catch (error) {
      return next(error);
    }
  });
};
