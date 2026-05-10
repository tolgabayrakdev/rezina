import { Router } from 'express';
import { CarController } from '../controller/car.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import upload from '../middleware/upload.js';
import {
  createCarSchema,
  updateCarSchema,
  addCarLinkSchema,
  addMaintenanceItemSchema,
  updateMaintenanceItemSchema,
  addServiceRecordSchema,
} from '../schemas/car.schema.js';

const router = Router();
const carController = new CarController();

router.use(authenticate);

// Cars
router.post('/', validate(createCarSchema), carController.create);
router.get('/', carController.list);
router.get('/:carId', carController.get);
router.patch('/:carId', validate(updateCarSchema), carController.update);
router.delete('/:carId', carController.delete);

// Images
router.post('/:carId/images', upload.single('image'), carController.addImage);
router.patch('/:carId/images/:imageId/cover', carController.setCover);
router.delete('/:carId/images/:imageId', carController.deleteImage);

// Links
router.post('/:carId/links', validate(addCarLinkSchema), carController.addLink);
router.get('/:carId/links', carController.getLinks);
router.delete('/:carId/links/:linkId', carController.deleteLink);

// Maintenance Items
router.get('/:carId/maintenance', carController.getMaintenanceItems);
router.post(
  '/:carId/maintenance',
  validate(addMaintenanceItemSchema),
  carController.addMaintenanceItem
);
router.patch(
  '/:carId/maintenance/:itemId',
  validate(updateMaintenanceItemSchema),
  carController.updateMaintenanceItem
);
router.delete('/:carId/maintenance/:itemId', carController.deleteMaintenanceItem);

// Service Records
router.get('/:carId/service-records', carController.getServiceRecords);
router.post(
  '/:carId/service-records',
  validate(addServiceRecordSchema),
  carController.addServiceRecord
);
router.delete('/:carId/service-records/:recordId', carController.deleteServiceRecord);

export default router;
