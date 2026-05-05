import Joi from 'joi';

const tr = {
  'string.base': '{{#label}} metin olmalıdır',
  'string.min': '{{#label}} en az {{#limit}} karakter olmalıdır',
  'string.max': '{{#label}} en fazla {{#limit}} karakter olabilir',
  'any.required': '{{#label}} zorunludur',
};

export const createWorkspaceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().label('Workspace adı'),
}).messages(tr);

export const updateWorkspaceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().label('Workspace adı'),
}).messages(tr);
