import Joi from 'joi';

const tr = {
  'string.base': '{{#label}} metin olmalıdır',
  'string.min': '{{#label}} en az {{#limit}} karakter olmalıdır',
  'string.max': '{{#label}} en fazla {{#limit}} karakter olabilir',
  'any.required': '{{#label}} zorunludur',
};

export const createCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(150).required().label('Ad Soyad'),
  phone: Joi.string().max(50).optional().allow('').label('Telefon'),
}).messages(tr);

export const updateCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(150).optional().label('Ad Soyad'),
  phone: Joi.string().max(50).optional().allow('').label('Telefon'),
})
  .min(1)
  .messages(tr);
