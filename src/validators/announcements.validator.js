import { celebrate, Joi, Segments } from 'celebrate';

export const createAnnouncementValidator = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
  }),
});

export const updateAnnouncementValidator = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    price: Joi.number().min(0),
  }),
});
