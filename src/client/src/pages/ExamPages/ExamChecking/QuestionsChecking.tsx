import { IconButton, Slider, Typography, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../components/TestPageLayout';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { exerciseWithAnswersType } from '../types';
import { computeAnswerStatus } from '../lib/computeAnswerStatus';
import { UpdateAnswersButtons } from './UpdateAnswersButtons';
import { questionKindType } from '../../../types';
import { computeAttemptIdNeighbours } from './lib/computeAttemptIdNeighbours';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { extractMarks, manualMarksType } from '../lib/extractMarks';
import { manualQuestionKinds } from '../../../constants';
import { computeResult } from '../lib/computeResult';
import { ExerciseTitle } from '../components/ExerciseTitle';

function QuestionsChecking(props: {
    refetch: () => void;
    exercises: Array<exerciseWithAnswersType>;
    examName: string;
    examId: string;
    studentEmail: string;
    attemptId: string;
}) {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const initialMarks = extractMarks(props.exercises);
    const [manualMarks, setManualMarks] = useState<manualMarksType>(initialMarks.manual);
    const { displayAlert } = useAlert();
    const result = computeResult(props.exercises);

    const saveMarkMutation = useMutation({
        mutationFn: api.updateMark,
        onSuccess: () => {
            props.refetch();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre dernière note n'a pas pu être sauvegardée.",
            });
        },
    });

    useEffect(() => {
        const marks = extractMarks(props.exercises);
        setManualMarks(marks.manual);
    }, [props.exercises]);

    const { next, previous } = computeAttemptIdNeighbours(
        props.attemptId,
        searchParams.get('attemptIds'),
    );

    const editableQuestionKindsAnswers: questionKindType[] = ['phraseMelangee', 'questionTrou'];

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
            buttons={[]}
            result={result}
        >
            <>
                <LeftArrowContainer>
                    <IconButton disabled={!previous} onClick={buildOnArrowClick(previous)}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </LeftArrowContainer>
                {props.exercises.map((exercise) => (
                    <ExerciseContainer key={exercise.id}>
                        <ExerciseTitle exercise={exercise} />
                        {exercise.questions.map((question, index: number) => {
                            const mark = manualQuestionKinds.includes(question.kind)
                                ? manualMarks[question.id]
                                : question.mark;
                            const answerStatus = computeAnswerStatus(mark, question.points);
                            return (
                                <QuestionCheckingContainer key={question.id}>
                                    <QuestionIndicatorsContainer>
                                        <QuestionIndicatorContainer>
                                            {manualQuestionKinds.includes(question.kind) ? (
                                                <MarkSliderContainer>
                                                    <Slider
                                                        onClick={buildOnClickSlider(question.id)}
                                                        onChange={buildOnChangeSlider(question.id)}
                                                        onChangeCommitted={buildOnChangeCommittedSlider(
                                                            question.id,
                                                        )}
                                                        size="small"
                                                        step={0.5}
                                                        min={0}
                                                        max={question.points}
                                                        valueLabelDisplay="auto"
                                                        marks
                                                        value={manualMarks[question.id] || 0}
                                                    />
                                                    <Typography>
                                                        {manualMarks[question.id] !== undefined
                                                            ? manualMarks[question.id]
                                                            : '...'}{' '}
                                                        / {question.points}
                                                    </Typography>
                                                </MarkSliderContainer>
                                            ) : (
                                                <Typography>
                                                    {question.mark} / {question.points}
                                                </Typography>
                                            )}
                                        </QuestionIndicatorContainer>

                                        {editableQuestionKindsAnswers.includes(question.kind) && (
                                            <UpdateAnswersButtons
                                                examId={props.examId}
                                                refetch={props.refetch}
                                                question={question}
                                            />
                                        )}
                                    </QuestionIndicatorsContainer>
                                    <QuestionChecking
                                        key={'question' + question.id}
                                        index={index + 1}
                                        question={question}
                                        answerStatus={answerStatus}
                                    />
                                </QuestionCheckingContainer>
                            );
                        })}
                    </ExerciseContainer>
                ))}
                <RightArrowContainer>
                    <IconButton disabled={!next} onClick={buildOnArrowClick(next)}>
                        <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                </RightArrowContainer>
            </>
        </TestPageLayout>
    );

    function buildOnChangeSlider(questionId: number) {
        return (event: Event, value: number | number[]) => {
            if (typeof value !== 'object') {
                setManualMarks({ ...manualMarks, [questionId]: value });
            }
        };
    }

    function buildOnClickSlider(questionId: number) {
        return () => {
            setManualMarks({ ...manualMarks, [questionId]: manualMarks[questionId] || 0 });
        };
    }

    function buildOnChangeCommittedSlider(questionId: number) {
        return (event: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
            if (typeof value !== 'object') {
                saveMarkMutation.mutate({ attemptId: props.attemptId, questionId, mark: value });
            }
        };
    }

    function buildOnArrowClick(attemptIdToNavigateTo: string | undefined) {
        return () => {
            if (!attemptIdToNavigateTo) {
                return;
            }

            navigateToNewAttempt(attemptIdToNavigateTo);
        };
    }

    function navigateToNewAttempt(newAttemptId: string) {
        navigate(
            `/teacher/exams/${props.examId}/results/${newAttemptId}?attemptIds=${searchParams.get(
                'attemptIds',
            )}`,
        );
    }
}
const ARROW_CONTAINER_SIZE = 100;

const LeftArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: theme.spacing(4),
    top: `calc(100vh / 2 - ${ARROW_CONTAINER_SIZE / 2}px)`,
    width: ARROW_CONTAINER_SIZE,
    height: ARROW_CONTAINER_SIZE,
}));

const RightArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    right: theme.spacing(4),
    top: `calc(100vh / 2 - ${ARROW_CONTAINER_SIZE / 2}px)`,
    width: ARROW_CONTAINER_SIZE,
    height: ARROW_CONTAINER_SIZE,
}));

const QuestionCheckingContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    display: 'flex',
}));

const QuestionIndicatorContainer = styled('div')({
    minWidth: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

const ExerciseContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.common.black}`,
}));

const MarkSliderContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginRight: theme.spacing(1),
}));
const ExerciseTitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const QuestionIndicatorsContainer = styled('div')({});

export { QuestionsChecking };
