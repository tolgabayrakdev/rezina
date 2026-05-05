import { Router } from 'express';
import { CustomerController } from '../controller/customer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer.schema.js';

const router = Router();
const customerController = new CustomerController();

router.use(authenticate);

router.post('/', validate(createCustomerSchema), customerController.create);
router.get('/', customerController.list);
router.get('/:customerId', customerController.get);
router.patch('/:customerId', validate(updateCustomerSchema), customerController.update);
router.delete('/:customerId', customerController.delete);

export default router;
