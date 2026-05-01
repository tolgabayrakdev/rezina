import Joi from 'joi';

const tr = {
  'string.base': '{{#label}} metin olmalıdır',
  'string.email': 'Geçerli bir e-posta adresi girin',
  'string.min': '{{#label}} en az {{#limit}} karakter olmalıdır',
  'string.max': '{{#label}} en fazla {{#limit}} karakter olabilir',
  'string.length': '{{#label}} {{#limit}} karakter olmalıdır',
  'string.alphanum': '{{#label}} yalnızca harf ve rakam içerebilir',
  'string.pattern.base': '{{#label}} geçerli bir format değil',
  'any.required': '{{#label}} zorunludur',
  'object.missing': 'userId veya email alanlarından en az biri zorunludur',
};

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(128).required(),
}).messages(tr);

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).messages(tr);

export const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required(),
}).messages(tr);

export const resendVerificationSchema = Joi.object({
  userId: Joi.string().uuid(),
  email: Joi.string().email(),
})
  .or('userId', 'email')
  .messages(tr);

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
}).messages(tr);

export const resetPasswordSchema = Joi.object({
  token: Joi.string().length(64).required(),
  newPassword: Joi.string().min(8).max(128).required(),
}).messages(tr);
