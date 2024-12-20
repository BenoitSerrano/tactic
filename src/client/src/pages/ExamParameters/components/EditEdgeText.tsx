import { styled, TextField } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { examApiType } from '../../Classe/types';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';
import { LoadingButton } from '@mui/lab';
import { ExamDoneText } from './ExamDoneText';
import { ExamStartText } from './ExamStartText';
import { IconButton } from '../../../components/IconButton';
import { examsApi } from '../../../lib/api/examsApi';
import { userConfigurationsApi } from '../../../lib/api/userConfigurationsApi';

type edgeTextKind = 'start' | 'end';

function EditEdgeText(props: { exam: examApiType; kind: edgeTextKind }) {
    const initialText = computeInitialText(props.kind, props.exam);
    const { displayAlert } = useAlert();
    const [text, setText] = useState(initialText);
    const queryClient = useQueryClient();

    const updateExamEdgeTextMutation = useMutation({
        mutationFn: examsApi.updateExamEdgeText,
        onSuccess: () => {
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

    const updateDefaultEdgeTextMutation = useMutation({
        mutationFn: userConfigurationsApi.updateDefaultEdgeText,
        onSuccess: () => {
            saveEdgeText();
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue lors de la sauvegarde du texte. Veuillez réessayer.',
            });
        },
    });

    return (
        <Container>
            <TextFieldContainer>
                <StyledTextField multiline fullWidth value={text} onChange={onChange} />
                <ButtonsContainer>
                    <IconButton
                        IconComponent={BookmarkAddIcon}
                        onClick={saveDefaultEdgeText}
                        title="Sauvegarder comme texte par défaut"
                    />
                    <LoadingButton
                        variant="outlined"
                        loading={updateExamEdgeTextMutation.isPending}
                        startIcon={<SaveIcon />}
                        onClick={saveEdgeText}
                    >
                        Sauvegarder
                    </LoadingButton>
                </ButtonsContainer>
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
                return exam.startText;
            case 'end':
                return exam.endText;
        }
    }

    function saveEdgeText() {
        updateExamEdgeTextMutation.mutate({ examId: props.exam.id, kind: props.kind, text });
    }

    function saveDefaultEdgeText() {
        updateDefaultEdgeTextMutation.mutate({ kind: props.kind, text });
    }
}

const Container = styled('div')(({ theme }) => ({ display: 'flex' }));
const TextFieldContainer = styled('div')(({ theme }) => ({
    flexDirection: 'column',
    flex: 1,
    paddingRight: theme.spacing(2),
    display: 'flex',
    borderRight: `dashed 2px ${theme.palette.divider}`,
}));
const StyledTextField = styled(TextField)(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const PreviewContainer = styled('div')(({ theme }) => ({
    flex: 1,
    paddingLeft: theme.spacing(2),
}));
const ButtonsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
}));

export { EditEdgeText };
