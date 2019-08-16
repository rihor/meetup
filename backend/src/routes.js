import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizingController from './app/controllers/OrganizingController';
import authMiddleware from './app/middlewares/auth';
// rotas de validação
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateMeetupStore from './app/validators/MeetupStore';
import validateMeetupUpdate from './app/validators/MeetupUpdate';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

// apartir daqui todos as rotas precisam de autenticação
routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);

routes.get('/meetup', MeetupController.index);
routes.get('/meetup/:meetupId', MeetupController.find);
routes.post('/meetup', validateMeetupStore, MeetupController.store);
routes.put('/meetup/:meetupId', validateMeetupUpdate, MeetupController.update);
routes.delete('/meetup/:meetupId', MeetupController.delete);

routes.get('/organizing', OrganizingController.index);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/meetup/:meetupId/subscribe', SubscriptionController.store);
routes.delete('/meetup/:meetupId/unsubscribe', SubscriptionController.delete);

// rota de upload de imagem
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
