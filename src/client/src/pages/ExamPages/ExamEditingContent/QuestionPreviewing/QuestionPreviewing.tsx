import { questionPreviewingComponentMapping } from '../constants';
import { styled } from '@mui/material';
import { QuestionContainer } from '../../components/QuestionContainer';
import { questionType } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { useAlert } from '../../../../lib/alert';
import { EditionActionMenu } from '../EditionActionMenu';
import { PointsPreviewing } from './PointsPreviewing';

function QuestionPreviewing(props: {
    question: questionType;
    index: number;
    examId: string;
    exerciseId: number;
    onDeleteQuestion: () => void;
    openEditingModal: (question: questionType) => void;
}): JSX.Element {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const deleteQuestionMutation = useMutation({
        mutationFn: api.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'with-questions'],
            });
            displayAlert({ variant: 'success', text: 'La question a été supprimée.' });
        },
    });

    const QuestionPreviewingComponent = questionPreviewingComponentMapping[props.question.kind];

    return (
        <QuestionContainer>
            <LeftContainer>
                <QuestionIndicatorsContainer>
                    <PointsPreviewing points={props.question.points} />
                </QuestionIndicatorsContainer>
                <EditionActionMenuContainer>
                    <EditionActionMenu
                        isDeleting={deleteQuestionMutation.isPending}
                        onDelete={deleteQuestion}
                        openEditingModal={openEditingModal}
                    />
                </EditionActionMenuContainer>
            </LeftContainer>

            <QuestionPreviewingComponent
                title={props.question.title}
                possibleAnswers={props.question.possibleAnswers}
                acceptableAnswers={props.question.acceptableAnswers}
                points={props.question.points}
                index={props.index}
            />
        </QuestionContainer>
    );

    function openEditingModal() {
        props.openEditingModal(props.question);
    }

    function deleteQuestion() {
        // eslint-disable-next-line no-restricted-globals
        const hasConfirmed = confirm(
            'Souhaitez-vous réellement supprimer cette question ? Tous les résultats des élèves pour cette question seront également supprimés.',
        );
        if (hasConfirmed) {
            props.onDeleteQuestion();

            deleteQuestionMutation.mutate({ examId: props.examId, questionId: props.question.id });
        }
    }
}
const EditionActionMenuContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
}));
const LeftContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

const QuestionIndicatorsContainer = styled('div')(({ theme }) => ({
    width: 100,
    display: 'flex',
    justifyContent: 'center',
}));

export { QuestionPreviewing };
