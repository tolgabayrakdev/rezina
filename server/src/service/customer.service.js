import { CustomerRepository } from '../repository/customer.repository.js';
import { NotFoundError } from '../exceptions/index.js';

export class CustomerService {
  constructor() {
    this.customerRepo = new CustomerRepository();
  }

  async createCustomer(userId, data) {
    return this.customerRepo.create({ userId, ...data });
  }

  async getCustomers(userId, search) {
    return this.customerRepo.findByUserId(userId, search);
  }

  async getCustomer(userId, customerId) {
    return this._findCustomer(customerId, userId);
  }

  async updateCustomer(userId, customerId, data) {
    await this._findCustomer(customerId, userId);
    return this.customerRepo.update(customerId, userId, data);
  }

  async deleteCustomer(userId, customerId) {
    await this._findCustomer(customerId, userId);
    await this.customerRepo.deleteById(customerId, userId);
  }

  async _findCustomer(customerId, userId) {
    const customer = await this.customerRepo.findById(customerId, userId);
    if (!customer) throw new NotFoundError('Müşteri bulunamadı');
    return customer;
  }
}
