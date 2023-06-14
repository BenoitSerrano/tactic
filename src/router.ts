import Express from 'express';
import { buildExamService } from './modules/exam';
import { dataSource } from './dataSource';

const router = Express.Router();

router.post('/exam', async (req, res) => {
    const examService = buildExamService(dataSource);
    const emptyExam = await examService.createExam(req.body.name);
    res.send(emptyExam);
});

export { router };
