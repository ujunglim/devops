import express from 'express';
import { getServerList, postServerAction, postServerGraph, postServerLog } from '../controllers/server';

const serverRouter = express.Router();
serverRouter.get('/list', getServerList);
serverRouter.post('/', postServerAction)
serverRouter.post('/detail/graph', postServerGraph);
serverRouter.post('/detail/log', postServerLog);

export default serverRouter;