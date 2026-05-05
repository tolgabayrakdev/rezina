import { Router } from 'express';
import { CarController } from '../controller/car.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createCarSchema,
  updateCarSchema,
  addCarImageSchema,
  addCarLinkSchema,
} from '../schemas/car.schema.js';

const router = Router({ mergeParams: true });
const carController = new CarController();

router.use(authenticate);

// Cars
router.post('/', validate(createCarSchema), carController.create);
router.get('/', carController.list);
router.get('/:carId', carController.get);
router.patch('/:carId', validate(updateCarSchema), carController.update);
router.delete('/:carId', carController.delete);

// Images
router.post('/:carId/images', validate(addCarImageSchema), carController.addImage);
router.patch('/:carId/images/:imageId/cover', carController.setCover);
router.delete('/:carId/images/:imageId', carController.deleteImage);

// Links
router.post('/:carId/links', validate(addCarLinkSchema), carController.addLink);
router.get('/:carId/links', carController.getLinks);
router.delete('/:carId/links/:linkId', carController.deleteLink);

export default router;
