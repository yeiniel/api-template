import { Application, Router } from 'express';
import { 
  RegisterController, 
  LoginController, 
  RefreshTokenController, 
  ValidateTokenController, 
  ForgotPasswordController,
  ResetPasswordController 
} from '../controllers/auth';

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

  // inject the application wide userModel if any
  (new ForgotPasswordController(app.get('userModel')))
    .setupRoute(router.route('/forgot-password'));

  // inject the application wide userModel if any
  (new ResetPasswordController(app.get('userModel')))
    .setupRoute(router.route('/reset-password'));
};
