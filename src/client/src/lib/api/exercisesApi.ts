import { questionKindType } from '../../types';
import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const exercisesApi = {
    updateExercisesOrder,
    updateExercise,
    createExercise,
    deleteExercise,
};

async function updateExercisesOrder(params: { examId: string; orderedIds: number[] }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/order`;
    return performApiCall(URL, 'PATCH', {
        orderedIds: params.orderedIds,
    });
}

async function updateExercise(params: {
    examId: string;
    exerciseId: number;
    name: string;
    instruction: string;
    defaultPoints: number | null;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'PUT', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
    });
}

async function createExercise(params: {
    examId: string;
    name: string;
    instruction: string;
    defaultPoints: number | null;
    defaultQuestionKind: questionKindType;
    order?: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises`;
    return performApiCall(URL, 'POST', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
        defaultQuestionKind: params.defaultQuestionKind,
        order: params.order,
    });
}

async function deleteExercise(params: { examId: string; exerciseId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'DELETE');
}

export { exercisesApi };
