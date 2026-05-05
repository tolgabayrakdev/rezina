import { InterestRepository } from '../repository/interest.repository.js';
import { WorkspaceRepository } from '../repository/workspace.repository.js';
import { CarRepository } from '../repository/car.repository.js';
import { CustomerRepository } from '../repository/customer.repository.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../exceptions/index.js';

export class InterestService {
  constructor() {
    this.interestRepo = new InterestRepository();
    this.workspaceRepo = new WorkspaceRepository();
    this.carRepo = new CarRepository();
    this.customerRepo = new CustomerRepository();
  }

  async createInterest(workspaceId, userId, { car_id, customer_id, note }) {
    await this._requireOwner(workspaceId, userId);

    const car = await this.carRepo.findById(car_id);
    if (!car || car.workspace_id !== workspaceId) throw new NotFoundError('Araç bulunamadı');

    const customer = await this.customerRepo.findById(customer_id);
    if (!customer || customer.workspace_id !== workspaceId) throw new NotFoundError('Müşteri bulunamadı');

    try {
      return await this.interestRepo.create({ carId: car_id, customerId: customer_id, note });
    } catch (err) {
      if (err.code === '23505') throw new ConflictError('Bu müşteri için zaten bir ilgi kaydı var');
      throw err;
    }
  }

  async getInterests(workspaceId, userId, filters) {
    await this._requireOwner(workspaceId, userId);
    return this.interestRepo.findByWorkspaceId(workspaceId, filters);
  }

  async getInterest(workspaceId, userId, interestId) {
    await this._requireOwner(workspaceId, userId);
    return this._findInterest(interestId, workspaceId);
  }

  async updateInterest(workspaceId, userId, interestId, data) {
    await this._requireOwner(workspaceId, userId);
    await this._findInterest(interestId, workspaceId);
    return this.interestRepo.update(interestId, data);
  }

  async deleteInterest(workspaceId, userId, interestId) {
    await this._requireOwner(workspaceId, userId);
    await this._findInterest(interestId, workspaceId);
    await this.interestRepo.deleteById(interestId);
  }

  async _requireOwner(workspaceId, userId) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError('Workspace bulunamadı');
    if (workspace.owner_id !== userId) throw new ForbiddenError('Bu workspace\'e erişim yetkiniz yok');
  }

  async _findInterest(interestId, workspaceId) {
    const interest = await this.interestRepo.findById(interestId);
    if (!interest || interest.car_workspace_id !== workspaceId) {
      throw new NotFoundError('İlgi kaydı bulunamadı');
    }
    return interest;
  }
}
