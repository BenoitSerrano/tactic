import { styled, TextField } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import { examApiType } from '../../ExamList/types';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { LoadingButton } from '@mui/lab';
import { ExamDoneText } from './ExamDoneText';
import { ExamStartText } from './ExamStartText';
import { IconButton } from '../../../components/IconButton';

type edgeTextKind = 'start' | 'end';

function EditEdgeText(props: { exam: examApiType; kind: edgeTextKind }) {
    const initialText = computeInitialText(props.kind, props.exam);
    const { displayAlert } = useAlert();
    const [text, setText] = useState(initialText);
    const queryClient = useQueryClient();

    const updateExamEdgeTextMutation = useMutation({
        mutationFn: api.updateExamEdgeText,
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
        mutationFn: api.updateDefaultEdgeText,
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
                    <LeftContainer>
                        <IconButton
                            IconComponent={BookmarkAddIcon}
                            onClick={saveDefaultEdgeText}
                            title="Sauvegarder comme texte par défaut"
                        />
                        <IconButton
                            IconComponent={RestoreIcon}
                            onClick={() => {}}
                            title="Annuler les modifications et restaurer le texte par défaut"
                        />
                    </LeftContainer>
                    <RightContainer>
                        <LoadingButton
                            variant="outlined"
                            loading={updateExamEdgeTextMutation.isPending}
                            startIcon={<SaveIcon />}
                            onClick={saveEdgeText}
                        >
                            Sauvegarder
                        </LoadingButton>
                    </RightContainer>
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
const LeftContainer = styled('div')(({ theme }) => ({}));
const RightContainer = styled('div')(({ theme }) => ({
    display: 'flex',
}));

export { EditEdgeText };
