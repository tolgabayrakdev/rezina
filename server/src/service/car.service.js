import { CarRepository } from '../repository/car.repository.js';
import { WorkspaceRepository } from '../repository/workspace.repository.js';
import { NotFoundError, ForbiddenError } from '../exceptions/index.js';

export class CarService {
  constructor() {
    this.carRepo = new CarRepository();
    this.workspaceRepo = new WorkspaceRepository();
  }

  // ── Cars ────────────────────────────────────────────────────────────────

  async createCar(workspaceId, userId, data) {
    await this._requireOwner(workspaceId, userId);
    return this.carRepo.create({ workspaceId, ...data });
  }

  async getCars(workspaceId, userId, filters) {
    await this._requireOwner(workspaceId, userId);
    return this.carRepo.findByWorkspaceId(workspaceId, filters);
  }

  async getCar(workspaceId, userId, carId) {
    await this._requireOwner(workspaceId, userId);
    const car = await this._findCar(carId, workspaceId);
    const [images, links] = await Promise.all([
      this.carRepo.findImagesByCarId(carId),
      this.carRepo.findLinksByCarId(carId),
    ]);
    return { ...car, images, links };
  }

  async updateCar(workspaceId, userId, carId, data) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);
    return this.carRepo.update(carId, data);
  }

  async deleteCar(workspaceId, userId, carId) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);
    await this.carRepo.deleteById(carId);
  }

  // ── Images ───────────────────────────────────────────────────────────────

  async addImage(workspaceId, userId, carId, { url, is_cover }) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);
    return this.carRepo.addImage({ carId, url, isCover: is_cover ?? false });
  }

  async setCover(workspaceId, userId, carId, imageId) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);

    const image = await this.carRepo.findImageById(imageId);
    if (!image || image.car_id !== carId) throw new NotFoundError('Fotoğraf bulunamadı');

    return this.carRepo.setCover(carId, imageId);
  }

  async deleteImage(workspaceId, userId, carId, imageId) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);

    const image = await this.carRepo.findImageById(imageId);
    if (!image || image.car_id !== carId) throw new NotFoundError('Fotoğraf bulunamadı');

    await this.carRepo.deleteImage(imageId);
  }

  // ── Links ────────────────────────────────────────────────────────────────

  async addLink(workspaceId, userId, carId, { platform, url }) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);
    return this.carRepo.addLink({ carId, platform, url });
  }

  async getLinks(workspaceId, userId, carId) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);
    return this.carRepo.findLinksByCarId(carId);
  }

  async deleteLink(workspaceId, userId, carId, linkId) {
    await this._requireOwner(workspaceId, userId);
    await this._findCar(carId, workspaceId);

    const link = await this.carRepo.findLinkById(linkId);
    if (!link || link.car_id !== carId) throw new NotFoundError('Link bulunamadı');

    await this.carRepo.deleteLink(linkId);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  async _requireOwner(workspaceId, userId) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError('Workspace bulunamadı');
    if (workspace.owner_id !== userId) throw new ForbiddenError('Bu workspace\'e erişim yetkiniz yok');
  }

  async _findCar(carId, workspaceId) {
    const car = await this.carRepo.findById(carId);
    if (!car || car.workspace_id !== workspaceId) throw new NotFoundError('Araç bulunamadı');
    return car;
  }
}
