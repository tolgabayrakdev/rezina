import { WorkspaceRepository } from '../repository/workspace.repository.js';
import { NotFoundError, ForbiddenError } from '../exceptions/index.js';

export class WorkspaceService {
  constructor() {
    this.workspaceRepo = new WorkspaceRepository();
  }

  async createWorkspace(userId, { name }) {
    return this.workspaceRepo.create({ name, ownerId: userId });
  }

  async getWorkspaces(userId) {
    return this.workspaceRepo.findByOwnerId(userId);
  }

  async getWorkspace(workspaceId, userId) {
    const workspace = await this._findOwned(workspaceId, userId);
    return workspace;
  }

  async updateWorkspace(workspaceId, userId, data) {
    await this._findOwned(workspaceId, userId);
    return this.workspaceRepo.update(workspaceId, data);
  }

  async deleteWorkspace(workspaceId, userId) {
    await this._findOwned(workspaceId, userId);
    await this.workspaceRepo.deleteById(workspaceId);
  }

  async _findOwned(workspaceId, userId) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError('Workspace bulunamadı');
    if (workspace.owner_id !== userId) throw new ForbiddenError('Bu workspace\'e erişim yetkiniz yok');
    return workspace;
  }
}
