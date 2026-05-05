import Joi from 'joi';

const tr = {
  'string.base': '{{#label}} metin olmalıdır',
  'string.max': '{{#label}} en fazla {{#limit}} karakter olabilir',
  'any.required': '{{#label}} zorunludur',
  'any.only': '{{#label}} geçersiz bir değer',
};

export const createInterestSchema = Joi.object({
  car_id: Joi.string().uuid().required().label('Araç'),
  customer_id: Joi.string().uuid().required().label('Müşteri'),
  note: Joi.string().max(2000).optional().allow('').label('Not'),
}).messages(tr);

export const updateInterestSchema = Joi.object({
  status: Joi.string()
    .valid('interested', 'test_drive', 'negotiating', 'lost', 'sold')
    .optional()
    .label('Durum'),
  note: Joi.string().max(2000).optional().allow('').label('Not'),
}).min(1).messages(tr);
