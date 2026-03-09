import { Course } from '@surf/nuxt-base/server/api/courses/types';
import { Exam } from '@surf/nuxt-base/server/api/me/exams/types';

export const toExam = (course: Course): Exam => {
    const signupFrom = new Date();
    signupFrom.setDate(signupFrom.getDate() - 1);

    return {
        id: course.id,
        programId: course.id.split('.')[1],
        institutionId: course.id.split('.')[0],
        name: course.name,
        code: course.id,
        signupFrom: signupFrom.toISOString().split('T')[0],
        outcome: course.learning_outcome,
        language: course.language,
        criteria: course.description,
        eqf: 6,
        participation: 'Gemengd',
        quality: course.edubadge,
        unit: course.unit,
        studypoints: course.studypoints,
    }
};