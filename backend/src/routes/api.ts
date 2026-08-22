import { Router } from 'express';
import workspacesRouter from './workspaces.js';
import filesRouter from './files.js';
import chatRouter from './chat.js';

const router = Router();

router.use('/workspaces', workspacesRouter);
router.use('/files', filesRouter);
router.use('/chat', chatRouter);

export default router;
