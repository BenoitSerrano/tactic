import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/Modal';
import { examsApi, examsWithExercisesType } from '../../../lib/api/examsApi';
import { Loader } from '../../../components/Loader';
import { InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useAlert } from '../../../lib/alert';
import { exercisesApi } from '../../../lib/api/exercisesApi';

function ExerciseImportModal(props: { isOpen: boolean; close: () => void; examId: string }) {
    const examsWithExercisesQuery = useQuery({
        queryFn: examsApi.getExamsWithExercises,
        queryKey: ['exams', 'with-exercises'],
    });
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const duplicateExerciseMutation = useMutation({
        mutationFn: exercisesApi.duplicateExercise,
        onSuccess: (exercise) => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId, 'with-questions'] });
            displayAlert({
                text: `L'exercice "${exercise.name}" a bien été importé`,
                variant: 'success',
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'exercice n'a pas pu être importé.",
            });
        },
    });
    if (!examsWithExercisesQuery.data) {
        if (examsWithExercisesQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }
    const isConfirmDisabled = selectedExerciseId === undefined;
    return (
        <Modal
            isConfirmDisabled={isConfirmDisabled}
            title="Importer un exercice déjà créé"
            size="small"
            close={props.close}
            isOpen={props.isOpen}
            onConfirm={duplicateExercise}
            isConfirmLoading={duplicateExerciseMutation.isPending}
        >
            <InputLabel id="grouped-select-label">Sélectionner l'exercice à importer</InputLabel>
            <Select
                fullWidth
                onChange={onSelectExerciseId}
                labelId="grouped-select-label"
                value={selectedExerciseId}
            >
                {renderSelectContent(examsWithExercisesQuery.data)}
            </Select>
        </Modal>
    );

    function onSelectExerciseId(event: SelectChangeEvent) {
        const newExerciseId = event.target.value;
        setSelectedExerciseId(newExerciseId);
    }

    function renderSelectContent(examsWithExercises: examsWithExercisesType) {
        const items: ReactNode[] = [];
        for (const exam of examsWithExercises) {
            items.push(<ListSubheader>{exam.name}</ListSubheader>);
            for (const exercise of exam.exercises) {
                items.push(<MenuItem value={exercise.id}>{exercise.name}</MenuItem>);
            }
        }
        return items;
    }

    function duplicateExercise() {
        if (!selectedExerciseId) {
            return;
        }
        duplicateExerciseMutation.mutate({
            exerciseId: Number(selectedExerciseId),
            newExamId: props.examId,
        });
    }
}

export { ExerciseImportModal };
