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

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// apartir daqui todos as rotas precisam de autenticação
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/meetup', MeetupController.index);
routes.get('/meetup/:meetupId', MeetupController.find);
routes.post('/meetup', MeetupController.store);
routes.put('/meetup/:meetupId', MeetupController.update);
routes.delete('/meetup/:meetupId', MeetupController.delete);

routes.get('/organizing', OrganizingController.index);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/meetup/:meetupId/subscribe', SubscriptionController.store);
routes.delete('/meetup/:meetupId/unsubscribe', SubscriptionController.delete);

// rota de upload de imagem
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
