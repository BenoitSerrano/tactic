import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { Section } from '../../../components/Section';
import { SelectExamExtremums } from '../../Classe/SelectExamExtremums';
import { examApiType } from '../../Classe/types';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material';
import { useAlert } from '../../../lib/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api/api';

function SelectExamExtremumsSection(props: { exam: examApiType }) {
    const initialStartDateTime = new Date(props.exam.startTime).getTime();
    const initialEndDateTime = props.exam.endTime
        ? new Date(props.exam.endTime).getTime()
        : Infinity;

    const [startDateTime, setStartDateTime] = useState<number | undefined>(initialStartDateTime);
    const [endDateTime, setEndDateTime] = useState<number | undefined>(initialEndDateTime);
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const updateExamDurationMutation = useMutation({
        mutationFn: api.updateExamDateTimeRange,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été modifié.`,
            });

            queryClient.invalidateQueries({ queryKey: [`exams`, props.exam.id] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Les modifications n'ont pas pu être enregistrées.",
            });
        },
    });

    return (
        <Section title="Date et heure de passage">
            <SelectExamExtremums
                startDateTime={startDateTime}
                endDateTime={endDateTime}
                setStartDateTime={setStartDateTime}
                setEndDateTime={setEndDateTime}
            />
            <ButtonContainer>
                <LoadingButton
                    variant="outlined"
                    loading={updateExamDurationMutation.isPending}
                    startIcon={<SaveIcon />}
                    onClick={saveExtremumDateTimes}
                >
                    Sauvegarder
                </LoadingButton>
            </ButtonContainer>
        </Section>
    );
    function saveExtremumDateTimes() {
        if (endDateTime === undefined || startDateTime === undefined) {
            return;
        }
        updateExamDurationMutation.mutate({ examId: props.exam.id, endDateTime, startDateTime });
    }
}

const ButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'end',
}));

export { SelectExamExtremumsSection };
