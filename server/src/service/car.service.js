import { CarRepository } from '../repository/car.repository.js';
import { NotFoundError } from '../exceptions/index.js';

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
      this.carRepo.findImagesByCarId(carId),
      this.carRepo.findLinksByCarId(carId),
    ]);
    return { ...car, images, links };
  }

  async updateCar(userId, carId, data) {
    await this._findCar(carId, userId);
    return this.carRepo.update(carId, data);
  }

  async deleteCar(userId, carId) {
    await this._findCar(carId, userId);
    await this.carRepo.deleteById(carId);
  }

  // ── Images ───────────────────────────────────────────────────────────────

  async addImage(userId, carId, { url, is_cover }) {
    await this._findCar(carId, userId);
    return this.carRepo.addImage({ carId, url, isCover: is_cover ?? false });
  }

  async setCover(userId, carId, imageId) {
    await this._findCar(carId, userId);

    const image = await this.carRepo.findImageById(imageId);
    if (!image || image.car_id !== carId) throw new NotFoundError('Fotoğraf bulunamadı');

    return this.carRepo.setCover(carId, imageId);
  }

  async deleteImage(userId, carId, imageId) {
    await this._findCar(carId, userId);

    const image = await this.carRepo.findImageById(imageId);
    if (!image || image.car_id !== carId) throw new NotFoundError('Fotoğraf bulunamadı');

    await this.carRepo.deleteImage(imageId);
  }

  // ── Links ────────────────────────────────────────────────────────────────

  async addLink(userId, carId, { platform, url }) {
    await this._findCar(carId, userId);
    return this.carRepo.addLink({ carId, platform, url });
  }

  async getLinks(userId, carId) {
    await this._findCar(carId, userId);
    return this.carRepo.findLinksByCarId(carId);
  }

  async deleteLink(userId, carId, linkId) {
    await this._findCar(carId, userId);

    const link = await this.carRepo.findLinkById(linkId);
    if (!link || link.car_id !== carId) throw new NotFoundError('Link bulunamadı');

    await this.carRepo.deleteLink(linkId);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  async _findCar(carId, userId) {
    const car = await this.carRepo.findById(carId);
    if (!car || car.user_id !== userId) throw new NotFoundError('Araç bulunamadı');
    return car;
  }
}
