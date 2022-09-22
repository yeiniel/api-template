import { Request, Router, Response, NextFunction } from 'express';
import {
  forgotPassword,
  login,
  refreshToken,
  register,
  resetPassword,
  validateToken
} from '../controllers/auth.controller';

export default (app: any) => {
  const router = Router();

  // Mount route as "/api/app"
  app.use('/api', router);

  router.post('/login', login);

  router.post('/register', register);

  router.post('/refresh-token', refreshToken);

  router.post('/validate-token', validateToken);

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
