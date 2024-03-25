import { TextField, Typography, styled } from '@mui/material';
import { computeDisplayedMark } from './lib/computeDisplayedMark';
import { questionWithAnswersType } from '../types';
import { FLOATING_NUMBER_REGEX } from '../../../constants';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';

function DisplayedMark(props: {
    question: questionWithAnswersType;
    isQuestionManuallyCorrected: boolean;
    attemptId: string;
    examId: string;
}) {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const saveManualMarkMutation = useMutation({
        mutationFn: api.updateManualMark,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre dernière note n'a pas pu être sauvegardée.",
            });
        },
    });

    const displayedMark = computeDisplayedMark(props.question);
    const [currentMark, setCurrentMark] = useState<string | undefined>(displayedMark.mark);
    useEffect(() => {
        setCurrentMark(displayedMark.mark);
    }, [displayedMark.mark]);
    if (!props.isQuestionManuallyCorrected) {
        return (
            <Typography>
                {currentMark} / {displayedMark.points}
            </Typography>
        );
    }

    return (
        <EditableMarkContainer>
            <EditableMarkInputContainer>
                <TextField
                    onChange={onChangeMark}
                    onBlur={validateAndSaveMark}
                    onSubmit={validateAndSaveMark}
                    variant="standard"
                    value={currentMark}
                />
            </EditableMarkInputContainer>
            <EditableMarkItemContainer>
                <Typography>/ {displayedMark.points}</Typography>
            </EditableMarkItemContainer>
        </EditableMarkContainer>
    );

    function onChangeMark(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setCurrentMark(value);
        }
    }

    function validateAndSaveMark() {
        if (currentMark !== undefined) {
            const castMark = Number(currentMark);
            if (castMark >= 0 && castMark <= props.question.points) {
                saveManualMarkMutation.mutate({
                    manualMark: castMark,
                    attemptId: props.attemptId,
                    examId: props.examId,
                    questionId: props.question.id,
                });
                return;
            }
        }
        setCurrentMark(displayedMark.mark);
    }
}
const EditableMarkContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const EditableMarkItemContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const EditableMarkInputContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
    width: '30%',
    display: 'flex',
    alignItems: 'center',
}));

export { DisplayedMark };
