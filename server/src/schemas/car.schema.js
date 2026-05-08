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
  fuel_type: Joi.string().valid('gasoline', 'diesel', 'lpg', 'electric', 'hybrid').optional().label('Yakıt Tipi'),
  transmission: Joi.string().valid('automatic', 'manual').optional().label('Vites'),
  body_type: Joi.string().valid('sedan', 'hatchback', 'suv', 'station_wagon', 'pickup', 'truck').optional().label('Kasa Tipi'),
  engine_power: Joi.number().integer().min(1).optional().label('Motor Gücü'),
  engine_volume: Joi.number().integer().min(1).optional().label('Motor Hacmi'),
  drive_type: Joi.string().valid('fwd', 'rwd', '4wd', 'awd').optional().label('Çekiş'),
  color: Joi.string().max(50).optional().allow('').label('Renk'),
  vehicle_type: Joi.string().valid('passenger', 'commercial').optional().allow(null).label('Araç Tipi'),
  insurance_date: Joi.date().iso().optional().allow(null).label('Sigorta Tarihi'),
  inspection_date: Joi.date().iso().optional().allow(null).label('Muayene Tarihi'),
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
  fuel_type: Joi.string().valid('gasoline', 'diesel', 'lpg', 'electric', 'hybrid').optional().allow(null).label('Yakıt Tipi'),
  transmission: Joi.string().valid('automatic', 'manual').optional().allow(null).label('Vites'),
  body_type: Joi.string().valid('sedan', 'hatchback', 'suv', 'station_wagon', 'pickup', 'truck').optional().allow(null).label('Kasa Tipi'),
  engine_power: Joi.number().integer().min(1).optional().allow(null).label('Motor Gücü'),
  engine_volume: Joi.number().integer().min(1).optional().allow(null).label('Motor Hacmi'),
  drive_type: Joi.string().valid('fwd', 'rwd', '4wd', 'awd').optional().allow(null).label('Çekiş'),
  color: Joi.string().max(50).optional().allow('', null).label('Renk'),
  vehicle_type: Joi.string().valid('passenger', 'commercial').optional().allow(null).label('Araç Tipi'),
  insurance_date: Joi.date().iso().optional().allow(null).label('Sigorta Tarihi'),
  inspection_date: Joi.date().iso().optional().allow(null).label('Muayene Tarihi'),
}).min(1).messages(tr);

export const addCarLinkSchema = Joi.object({
  platform: Joi.string().max(100).required().label('Platform'),
  url: Joi.string().uri().required().label('İlan URL'),
}).messages(tr);

export const addMaintenanceItemSchema = Joi.object({
  name: Joi.string().max(255).required().label('Bakım Adı'),
  interval_km: Joi.number().integer().min(1).required().label('Aralık (km)'),
  last_done_mileage: Joi.number().integer().min(0).optional().allow(null).label('Son KM'),
  notes: Joi.string().max(1000).optional().allow('', null).label('Notlar'),
}).messages(tr);

export const updateMaintenanceItemSchema = Joi.object({
  name: Joi.string().max(255).optional().label('Bakım Adı'),
  interval_km: Joi.number().integer().min(1).optional().label('Aralık (km)'),
  last_done_mileage: Joi.number().integer().min(0).optional().allow(null).label('Son KM'),
  notes: Joi.string().max(1000).optional().allow('', null).label('Notlar'),
}).min(1).messages(tr);

export const addServiceRecordSchema = Joi.object({
  title: Joi.string().max(255).required().label('Başlık'),
  mileage: Joi.number().integer().min(0).optional().allow(null).label('KM'),
  service_date: Joi.date().iso().optional().allow(null).label('Tarih'),
  notes: Joi.string().max(2000).optional().allow('', null).label('Notlar'),
}).messages(tr);
