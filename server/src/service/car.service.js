import { CarRepository } from '../repository/car.repository.js';
import { NotFoundError } from '../exceptions/index.js';
import cloudinary from '../config/cloudinary.js';

export class CarService {
  constructor() {
    this.carRepo = new CarRepository();
  }

  // ── Cars ────────────────────────────────────────────────────────────────

  async createCar(userId, data) {
    return this.carRepo.create({ userId, ...data });
  }

  async getCars(userId, filters) {
    return this.carRepo.findByUserId(userId, filters);
  }

  async getCar(userId, carId) {
    const car = await this._findCar(carId, userId);
    const [images, links] = await Promise.all([
      this.carRepo.findImagesByCarId(carId, userId),
      this.carRepo.findLinksByCarId(carId, userId),
    ]);
    return { ...car, images, links };
  }

  async updateCar(userId, carId, data) {
    await this._findCar(carId, userId);
    return this.carRepo.update(carId, userId, data);
  }

  async deleteCar(userId, carId) {
    await this._findCar(carId, userId);
    await this.carRepo.deleteById(carId, userId);
  }

  // ── Images ───────────────────────────────────────────────────────────────

  async addImage(userId, carId, file, isCover) {
    await this._findCar(carId, userId);

    const { url, public_id } = await this._uploadToCloudinary(file.buffer, file.mimetype);
    return this.carRepo.addImage({ carId, userId, url, publicId: public_id, isCover: isCover ?? false });
  }

  async setCover(userId, carId, imageId) {
    await this._findCar(carId, userId);

    const image = await this.carRepo.findImageById(imageId, userId);
    if (!image || image.car_id !== carId) throw new NotFoundError('Fotoğraf bulunamadı');

    return this.carRepo.setCover(carId, userId, imageId);
  }

  async deleteImage(userId, carId, imageId) {
    await this._findCar(carId, userId);

    const image = await this.carRepo.findImageById(imageId, userId);
    if (!image || image.car_id !== carId) throw new NotFoundError('Fotoğraf bulunamadı');

    const deleted = await this.carRepo.deleteImage(imageId, userId);
    if (deleted?.public_id) {
      cloudinary.uploader.destroy(deleted.public_id).catch(() => {});
    }
  }

  _uploadToCloudinary(buffer, mimetype) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'rezina/cars', resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });
  }

  // ── Links ────────────────────────────────────────────────────────────────

  async addLink(userId, carId, { platform, url }) {
    await this._findCar(carId, userId);
    return this.carRepo.addLink({ carId, userId, platform, url });
  }

  async getLinks(userId, carId) {
    await this._findCar(carId, userId);
    return this.carRepo.findLinksByCarId(carId, userId);
  }

  async deleteLink(userId, carId, linkId) {
    await this._findCar(carId, userId);

    const link = await this.carRepo.findLinkById(linkId, userId);
    if (!link || link.car_id !== carId) throw new NotFoundError('Link bulunamadı');

    await this.carRepo.deleteLink(linkId, userId);
  }

  // ── Maintenance Items ────────────────────────────────────────────────────

  async getMaintenanceItems(userId, carId) {
    await this._findCar(carId, userId);
    return this.carRepo.findMaintenanceItems(carId, userId);
  }

  async addMaintenanceItem(userId, carId, data) {
    await this._findCar(carId, userId);
    return this.carRepo.addMaintenanceItem({ carId, userId, ...data });
  }

  async updateMaintenanceItem(userId, carId, itemId, data) {
    await this._findCar(carId, userId);
    const item = await this.carRepo.updateMaintenanceItem(itemId, carId, userId, data);
    if (!item) throw new NotFoundError('Bakım kalemi bulunamadı');
    return item;
  }

  async deleteMaintenanceItem(userId, carId, itemId) {
    await this._findCar(carId, userId);
    const item = await this.carRepo.deleteMaintenanceItem(itemId, carId, userId);
    if (!item) throw new NotFoundError('Bakım kalemi bulunamadı');
  }

  // ── Service Records ──────────────────────────────────────────────────────

  async getServiceRecords(userId, carId) {
    await this._findCar(carId, userId);
    return this.carRepo.findServiceRecords(carId, userId);
  }

  async addServiceRecord(userId, carId, data) {
    await this._findCar(carId, userId);
    return this.carRepo.addServiceRecord({ carId, userId, ...data });
  }

  async deleteServiceRecord(userId, carId, recordId) {
    await this._findCar(carId, userId);
    const record = await this.carRepo.deleteServiceRecord(recordId, carId, userId);
    if (!record) throw new NotFoundError('Servis kaydı bulunamadı');
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  async _findCar(carId, userId) {
    const car = await this.carRepo.findById(carId, userId);
    if (!car) throw new NotFoundError('Araç bulunamadı');
    return car;
  }
}
