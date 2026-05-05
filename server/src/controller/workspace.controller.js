import { WorkspaceService } from '../service/workspace.service.js';

export class WorkspaceController {
  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  create = async (req, res, next) => {
    try {
      const workspace = await this.workspaceService.createWorkspace(req.user.id, req.body);
      res.status(201).json({ success: true, data: workspace });
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const workspaces = await this.workspaceService.getWorkspaces(req.user.id);
      res.status(200).json({ success: true, data: workspaces });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const workspace = await this.workspaceService.getWorkspace(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: workspace });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const workspace = await this.workspaceService.updateWorkspace(req.params.id, req.user.id, req.body);
      res.status(200).json({ success: true, data: workspace });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.workspaceService.deleteWorkspace(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: { message: 'Workspace silindi' } });
    } catch (err) {
      next(err);
    }
  };
}
