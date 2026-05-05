import { Router } from 'express';
import { WorkspaceController } from '../controller/workspace.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../schemas/workspace.schema.js';

const router = Router();
const workspaceController = new WorkspaceController();

router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), workspaceController.create);
router.get('/', workspaceController.list);
router.get('/:id', workspaceController.get);
router.patch('/:id', validate(updateWorkspaceSchema), workspaceController.update);
router.delete('/:id', workspaceController.delete);

export default router;
