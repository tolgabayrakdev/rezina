import { CarService } from '../service/car.service.js';

export class CarController {
  constructor() {
    this.carService = new CarService();
  }

  create = async (req, res, next) => {
    try {
      const car = await this.carService.createCar(req.user.id, req.body);
      res.status(201).json({ success: true, data: car });
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const { status, brand, model } = req.query;
      const cars = await this.carService.getCars(req.user.id, { status, brand, model });
      res.status(200).json({ success: true, data: cars });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const car = await this.carService.getCar(req.user.id, req.params.carId);
      res.status(200).json({ success: true, data: car });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const car = await this.carService.updateCar(req.user.id, req.params.carId, req.body);
      res.status(200).json({ success: true, data: car });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.carService.deleteCar(req.user.id, req.params.carId);
      res.status(200).json({ success: true, data: { message: 'Araç silindi' } });
    } catch (err) {
      next(err);
    }
  };

  // ── Images ───────────────────────────────────────────────────────────────

  addImage = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Resim dosyası gereklidir' });
      }
      const isCover = req.body.is_cover === 'true' || req.body.is_cover === true;
      const image = await this.carService.addImage(
        req.user.id,
        req.params.carId,
        req.file,
        isCover
      );
      res.status(201).json({ success: true, data: image });
    } catch (err) {
      next(err);
    }
  };

  setCover = async (req, res, next) => {
    try {
      const image = await this.carService.setCover(
        req.user.id,
        req.params.carId,
        req.params.imageId
      );
      res.status(200).json({ success: true, data: image });
    } catch (err) {
      next(err);
    }
  };

  deleteImage = async (req, res, next) => {
    try {
      await this.carService.deleteImage(req.user.id, req.params.carId, req.params.imageId);
      res.status(200).json({ success: true, data: { message: 'Fotoğraf silindi' } });
    } catch (err) {
      next(err);
    }
  };

  // ── Links ────────────────────────────────────────────────────────────────

  addLink = async (req, res, next) => {
    try {
      const link = await this.carService.addLink(req.user.id, req.params.carId, req.body);
      res.status(201).json({ success: true, data: link });
    } catch (err) {
      next(err);
    }
  };

  getLinks = async (req, res, next) => {
    try {
      const links = await this.carService.getLinks(req.user.id, req.params.carId);
      res.status(200).json({ success: true, data: links });
    } catch (err) {
      next(err);
    }
  };

  deleteLink = async (req, res, next) => {
    try {
      await this.carService.deleteLink(req.user.id, req.params.carId, req.params.linkId);
      res.status(200).json({ success: true, data: { message: 'Link silindi' } });
    } catch (err) {
      next(err);
    }
  };

  // ── Maintenance Items ────────────────────────────────────────────────────

  getMaintenanceItems = async (req, res, next) => {
    try {
      const items = await this.carService.getMaintenanceItems(req.user.id, req.params.carId);
      res.status(200).json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  };

  addMaintenanceItem = async (req, res, next) => {
    try {
      const item = await this.carService.addMaintenanceItem(
        req.user.id,
        req.params.carId,
        req.body
      );
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  updateMaintenanceItem = async (req, res, next) => {
    try {
      const item = await this.carService.updateMaintenanceItem(
        req.user.id,
        req.params.carId,
        req.params.itemId,
        req.body
      );
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  deleteMaintenanceItem = async (req, res, next) => {
    try {
      await this.carService.deleteMaintenanceItem(req.user.id, req.params.carId, req.params.itemId);
      res.status(200).json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  };

  // ── Service Records ──────────────────────────────────────────────────────

  getServiceRecords = async (req, res, next) => {
    try {
      const records = await this.carService.getServiceRecords(req.user.id, req.params.carId);
      res.status(200).json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  };

  addServiceRecord = async (req, res, next) => {
    try {
      const record = await this.carService.addServiceRecord(
        req.user.id,
        req.params.carId,
        req.body
      );
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  };

  deleteServiceRecord = async (req, res, next) => {
    try {
      await this.carService.deleteServiceRecord(req.user.id, req.params.carId, req.params.recordId);
      res.status(200).json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  };
}
