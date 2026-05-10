import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
})
  .min(1)
  .messages({
    'any.required': '{{#label}} zorunludur',
    'string.email': 'Geçerli bir e-posta adresi girin',
    'object.min': 'En az bir alan gereklidir',
  });

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).max(128).required(),
}).messages({
  'any.required': '{{#label}} zorunludur',
  'string.min': '{{#label}} en az {{#limit}} karakter olmalıdır',
});
