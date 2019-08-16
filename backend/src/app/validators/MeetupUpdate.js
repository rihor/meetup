import * as Yup from 'yup';

export default async (request, response, next) => {
  try {
    // schema de validação
    const schema = Yup.object().shape({
      title: Yup.string(),
      banner_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    await schema.validate(request.body, { abortEarly: false });
    return next();
  } catch (error) {
    return response
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }
};
