import { InterestService } from '../service/interest.service.js';

export class InterestController {
  constructor() {
    this.interestService = new InterestService();
  }

  create = async (req, res, next) => {
    try {
      const interest = await this.interestService.createInterest(
        req.params.workspaceId,
        req.user.id,
        req.body
      );
      res.status(201).json({ success: true, data: interest });
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const { status, car_id, customer_id } = req.query;
      const interests = await this.interestService.getInterests(
        req.params.workspaceId,
        req.user.id,
        { status, car_id, customer_id }
      );
      res.status(200).json({ success: true, data: interests });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const interest = await this.interestService.getInterest(
        req.params.workspaceId,
        req.user.id,
        req.params.interestId
      );
      res.status(200).json({ success: true, data: interest });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const interest = await this.interestService.updateInterest(
        req.params.workspaceId,
        req.user.id,
        req.params.interestId,
        req.body
      );
      res.status(200).json({ success: true, data: interest });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.interestService.deleteInterest(
        req.params.workspaceId,
        req.user.id,
        req.params.interestId
      );
      res.status(200).json({ success: true, data: { message: 'İlgi kaydı silindi' } });
    } catch (err) {
      next(err);
    }
  };
}
