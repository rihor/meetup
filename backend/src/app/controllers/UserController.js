import User from '../models/User';

class UserController {
  async store(req, res) {
    // evitar erros caso o password seja passado como numerico
    req.body.password = String(req.body.password);

    // caso o email já tenha sido cadastrado
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // criação do usuário
    const { id, email, name } = await User.create(req.body);
    return res.json({
      id,
      email,
      name,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // caso queira mudar o email
    if (email !== undefined && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email });
  }
}

export default new UserController();
