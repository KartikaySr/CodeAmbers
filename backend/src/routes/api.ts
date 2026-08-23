import { Router } from 'express';
import workspacesRouter from './workspaces.js';
import filesRouter from './files.js';
import chatRouter from './chat.js';
import uploadRouter from './upload.js';

const router = Router();

router.use('/workspaces', workspacesRouter);
router.use('/files', filesRouter);
router.use('/chat', chatRouter);
router.use('/upload', uploadRouter);

export default router;
