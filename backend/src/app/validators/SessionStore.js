import * as Yup from 'yup';

export default async (request, response, next) => {
  try {
    // schema de validação
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    await schema.validate(request.body, { abortEarly: false });
    return next();
  } catch (error) {
    return response
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }
};
