import express from 'express';
import { upsertSubjects } from '../controllers/subject.controller.js';

const router = express.Router();

router.post('/save', upsertSubjects);

export default router;
