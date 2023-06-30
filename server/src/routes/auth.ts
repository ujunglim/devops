import express from 'express';
import { logIn } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/login', logIn);

export default authRouter;