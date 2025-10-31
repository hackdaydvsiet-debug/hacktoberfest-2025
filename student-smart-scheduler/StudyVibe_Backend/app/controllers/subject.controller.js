import Subject from '../models/subject.js';

export const upsertSubjects = async (req, res) => {
    try {
        const { userId, subjects } = req.body;

        await Subject.deleteMany({ userId }); // Remove previous subjects

        const createdSubjects = await Subject.insertMany(
            subjects.map(subject => ({ ...subject, userId }))
        );

        res.status(200).json(createdSubjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
