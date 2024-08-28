import { styled, TextField } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { examApiType } from '../../ExamList/types';
import { defaultEndText, defaultStartText } from '../../ExamPages/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { LoadingButton } from '@mui/lab';
import { ExamDoneText } from './ExamDoneText';
import { ExamStartText } from './ExamStartText';

type edgeTextKind = 'start' | 'end';

function EditEdgeText(props: { exam: examApiType; kind: edgeTextKind }) {
    const initialText = computeInitialText(props.kind, props.exam);
    const { displayAlert } = useAlert();
    const [text, setText] = useState(initialText);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: api.updateExamEdgeText,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['exams', props.exam.id],
            });
            displayAlert({
                variant: 'success',
                text: 'Le texte a été modifié.',
            });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue lors de la modification du texte. Veuillez réessayer.',
            });
        },
    });

    return (
        <Container>
            <TextFieldContainer>
                <StyledTextField multiline fullWidth value={text} onChange={onChange} />
                <LoadingButton
                    variant="outlined"
                    loading={mutation.isPending}
                    startIcon={<SaveIcon />}
                    onClick={saveEdgeText}
                >
                    Sauvegarder
                </LoadingButton>
            </TextFieldContainer>
            <PreviewContainer>{renderPreviewText()}</PreviewContainer>
        </Container>
    );

    function renderPreviewText() {
        switch (props.kind) {
            case 'end':
                return <ExamDoneText examEndText={props.exam.endText} />;
            case 'start':
                return (
                    <ExamStartText
                        name={props.exam.name}
                        duration={props.exam.duration}
                        examStartText={initialText}
                    />
                );
        }
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    function computeInitialText(kind: edgeTextKind, exam: examApiType) {
        switch (kind) {
            case 'start':
                return exam.startText !== null ? exam.startText : defaultStartText;
            case 'end':
                return exam.endText !== null ? exam.endText : defaultEndText;
        }
    }

    function saveEdgeText() {
        let newText: string | null = null;
        switch (props.kind) {
            case 'start':
                newText = text === defaultStartText ? null : text;
                break;
            case 'end':
                newText = text === defaultEndText ? null : text;
                break;
        }

        mutation.mutate({ examId: props.exam.id, kind: props.kind, text: newText });
    }
}

const Container = styled('div')(({ theme }) => ({ display: 'flex' }));
const TextFieldContainer = styled('div')(({ theme }) => ({
    flexDirection: 'column',
    flex: 1,
    paddingRight: theme.spacing(2),
    alignItems: 'flex-end',
    display: 'flex',
    borderRight: `dashed 2px ${theme.palette.divider}`,
}));
const StyledTextField = styled(TextField)(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const PreviewContainer = styled('div')(({ theme }) => ({
    flex: 1,
    paddingLeft: theme.spacing(2),
}));

export { EditEdgeText };
