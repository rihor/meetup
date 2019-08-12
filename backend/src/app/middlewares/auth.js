import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // caso o token não tenha sido providenciado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  const [, token] = authHeader.split(' ');

  try {
    // transforma o jwt.verify em um método await
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // permite o acesso ao id do usuário apartir daqui
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
