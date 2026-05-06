import Joi from 'joi';

const tr = {
  'string.base': '{{#label}} metin olmalıdır',
  'string.min': '{{#label}} en az {{#limit}} karakter olmalıdır',
  'string.max': '{{#label}} en fazla {{#limit}} karakter olabilir',
  'string.uri': '{{#label}} geçerli bir URL olmalıdır',
  'number.base': '{{#label}} sayı olmalıdır',
  'number.min': '{{#label}} {{#limit}} değerinden küçük olamaz',
  'number.max': '{{#label}} {{#limit}} değerinden büyük olamaz',
  'number.integer': '{{#label}} tam sayı olmalıdır',
  'any.required': '{{#label}} zorunludur',
  'any.only': '{{#label}} geçersiz bir değer',
};

export const createCarSchema = Joi.object({
  title: Joi.string().min(2).max(255).required().label('Başlık'),
  brand: Joi.string().max(100).optional().label('Marka'),
  model: Joi.string().max(100).optional().label('Model'),
  year: Joi.number().integer().min(1900).max(2100).optional().label('Yıl'),
  mileage: Joi.number().integer().min(0).optional().label('Kilometre'),
  price: Joi.number().min(0).optional().label('Fiyat'),
  status: Joi.string().valid('in_stock', 'reserved', 'sold').default('in_stock').label('Durum'),
  description: Joi.string().max(5000).optional().allow('').label('Açıklama'),
}).messages(tr);

export const updateCarSchema = Joi.object({
  title: Joi.string().min(2).max(255).optional().label('Başlık'),
  brand: Joi.string().max(100).optional().allow('').label('Marka'),
  model: Joi.string().max(100).optional().allow('').label('Model'),
  year: Joi.number().integer().min(1900).max(2100).optional().allow(null).label('Yıl'),
  mileage: Joi.number().integer().min(0).optional().allow(null).label('Kilometre'),
  price: Joi.number().min(0).optional().allow(null).label('Fiyat'),
  status: Joi.string().valid('in_stock', 'reserved', 'sold').optional().label('Durum'),
  description: Joi.string().max(5000).optional().allow('').label('Açıklama'),
  expertise: Joi.object().optional().allow(null).label('Ekspertiz'),
}).min(1).messages(tr);

export const addCarImageSchema = Joi.object({
  url: Joi.string().uri().required().label('Fotoğraf URL'),
  is_cover: Joi.boolean().default(false).label('Kapak'),
}).messages(tr);

export const addCarLinkSchema = Joi.object({
  platform: Joi.string().max(100).required().label('Platform'),
  url: Joi.string().uri().required().label('İlan URL'),
}).messages(tr);
