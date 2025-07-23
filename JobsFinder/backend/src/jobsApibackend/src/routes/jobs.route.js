import express from 'express';
import { getJobs } from '../controller/jobs.controller.js';

const router = express.Router();

router.get('/jobs', getJobs);

export default router;
