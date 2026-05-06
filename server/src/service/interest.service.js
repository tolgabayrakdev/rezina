import { InterestRepository } from '../repository/interest.repository.js';
import { CarRepository } from '../repository/car.repository.js';
import { CustomerRepository } from '../repository/customer.repository.js';
import { NotFoundError, ConflictError } from '../exceptions/index.js';

export class InterestService {
  constructor() {
    this.interestRepo = new InterestRepository();
    this.carRepo = new CarRepository();
    this.customerRepo = new CustomerRepository();
  }

  async createInterest(userId, { car_id, customer_id, note }) {
    const car = await this.carRepo.findById(car_id, userId);
    if (!car) throw new NotFoundError('Araç bulunamadı');

    const customer = await this.customerRepo.findById(customer_id, userId);
    if (!customer) throw new NotFoundError('Müşteri bulunamadı');

    try {
      return await this.interestRepo.create({
        carId: car_id,
        customerId: customer_id,
        userId,
        note,
      });
    } catch (err) {
      if (err.code === '23505') throw new ConflictError('Bu müşteri için zaten bir ilgi kaydı var');
      throw err;
    }
  }

  async getInterests(userId, filters) {
    return this.interestRepo.findByUserId(userId, filters);
  }

  async getInterest(userId, interestId) {
    return this._findInterest(interestId, userId);
  }

  async updateInterest(userId, interestId, data) {
    await this._findInterest(interestId, userId);
    return this.interestRepo.update(interestId, userId, data);
  }

  async deleteInterest(userId, interestId) {
    await this._findInterest(interestId, userId);
    await this.interestRepo.deleteById(interestId, userId);
  }

  async _findInterest(interestId, userId) {
    const interest = await this.interestRepo.findById(interestId, userId);
    if (!interest) {
      throw new NotFoundError('İlgi kaydı bulunamadı');
    }
    return interest;
  }
}
