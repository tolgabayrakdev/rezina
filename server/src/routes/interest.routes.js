import { Router } from 'express';
import { InterestController } from '../controller/interest.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createInterestSchema, updateInterestSchema } from '../schemas/interest.schema.js';

const router = Router();
const interestController = new InterestController();

router.use(authenticate);

router.post('/', validate(createInterestSchema), interestController.create);
router.get('/', interestController.list);
router.get('/:interestId', interestController.get);
router.patch('/:interestId', validate(updateInterestSchema), interestController.update);
router.delete('/:interestId', interestController.delete);

export default router;
