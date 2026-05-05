import { CustomerService } from '../service/customer.service.js';

export class CustomerController {
  constructor() {
    this.customerService = new CustomerService();
  }

  create = async (req, res, next) => {
    try {
      const customer = await this.customerService.createCustomer(req.params.workspaceId, req.user.id, req.body);
      res.status(201).json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const customers = await this.customerService.getCustomers(
        req.params.workspaceId,
        req.user.id,
        req.query.search
      );
      res.status(200).json({ success: true, data: customers });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const customer = await this.customerService.getCustomer(
        req.params.workspaceId,
        req.user.id,
        req.params.customerId
      );
      res.status(200).json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const customer = await this.customerService.updateCustomer(
        req.params.workspaceId,
        req.user.id,
        req.params.customerId,
        req.body
      );
      res.status(200).json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.customerService.deleteCustomer(
        req.params.workspaceId,
        req.user.id,
        req.params.customerId
      );
      res.status(200).json({ success: true, data: { message: 'Müşteri silindi' } });
    } catch (err) {
      next(err);
    }
  };
}
