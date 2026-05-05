import { CustomerRepository } from '../repository/customer.repository.js';
import { WorkspaceRepository } from '../repository/workspace.repository.js';
import { NotFoundError, ForbiddenError } from '../exceptions/index.js';

export class CustomerService {
  constructor() {
    this.customerRepo = new CustomerRepository();
    this.workspaceRepo = new WorkspaceRepository();
  }

  async createCustomer(workspaceId, userId, data) {
    await this._requireOwner(workspaceId, userId);
    return this.customerRepo.create({ workspaceId, ...data });
  }

  async getCustomers(workspaceId, userId, search) {
    await this._requireOwner(workspaceId, userId);
    return this.customerRepo.findByWorkspaceId(workspaceId, search);
  }

  async getCustomer(workspaceId, userId, customerId) {
    await this._requireOwner(workspaceId, userId);
    return this._findCustomer(customerId, workspaceId);
  }

  async updateCustomer(workspaceId, userId, customerId, data) {
    await this._requireOwner(workspaceId, userId);
    await this._findCustomer(customerId, workspaceId);
    return this.customerRepo.update(customerId, data);
  }

  async deleteCustomer(workspaceId, userId, customerId) {
    await this._requireOwner(workspaceId, userId);
    await this._findCustomer(customerId, workspaceId);
    await this.customerRepo.deleteById(customerId);
  }

  async _requireOwner(workspaceId, userId) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError('Workspace bulunamadı');
    if (workspace.owner_id !== userId) throw new ForbiddenError('Bu workspace\'e erişim yetkiniz yok');
  }

  async _findCustomer(customerId, workspaceId) {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer || customer.workspace_id !== workspaceId) throw new NotFoundError('Müşteri bulunamadı');
    return customer;
  }
}
