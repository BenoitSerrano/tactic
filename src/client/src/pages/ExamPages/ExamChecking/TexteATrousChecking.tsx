import { useState } from 'react';
import { Menu, Typography, styled } from '@mui/material';
import { displayedAnswerType } from '../lib/computeDisplayedAnswer';
import { attributeGradeToAnswerActions } from './constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { computeCanTexteATrousAnswerBeAttributed } from './lib/computeCanTexteATrousAnswerBeAttributed';
import { computeIsTexteATrousUpdateAnswerButtonLoading } from './lib/computeIsTexteATrousUpdateAnswerButtonLoading';
import { attemptStatusType, gradeType } from '../../../types';
import { questionWithAnswersType } from '../types';
import { gradeConverter } from '../../../lib/gradeConverter';
import { IconButton } from '../../../components/IconButton';
import { TAT_BLANK_STRING } from '../../../constants';

const styledContainerMapping = {
    right: styled('span')(({ theme }) => ({
        color: theme.palette.success.main,
        cursor: 'pointer',
    })),
    acceptable: styled('span')(({ theme }) => ({
        color: theme.palette.warning.main,
        cursor: 'pointer',
    })),
    wrong: styled('span')(({ theme }) => ({ color: theme.palette.error.main, cursor: 'pointer' })),
};

function TexteATrousChecking(props: {
    index: number;
    question: questionWithAnswersType;
    attemptId: string;
    examId: string;
    displayedAnswer: displayedAnswerType;
    canUpdateAnswers: boolean;
    attemptStatus?: attemptStatusType;
}) {
    const [currentChunkMenu, setCurrentChunkMenu] = useState<{
        element: HTMLElement;
        chunkIndex: number;
    } | null>(null);

    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const addQuestionAcceptableAnswerToTexteATrousMutation = useMutation({
        mutationFn: api.addQuestionAcceptableAnswerToTexteATrous,
        onSuccess: () => {
            closeChunkMenu();
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const removeOkAnswerFromTexteATrousMutation = useMutation({
        mutationFn: api.removeOkAnswerFromTexteATrous,
        onSuccess: () => {
            closeChunkMenu();
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const blankCount = props.question.title
        .split(' ')
        .filter((word) => word === TAT_BLANK_STRING).length;

    const pointsPerBlank = props.question.points / blankCount;

    const isMenuOpen = Boolean(currentChunkMenu);

    return (
        <Container>
            {props.canUpdateAnswers && (
                <Menu
                    anchorEl={currentChunkMenu?.element}
                    open={isMenuOpen}
                    onClose={closeChunkMenu}
                >
                    {!!currentChunkMenu && (
                        <MenuContentContainer>
                            <IconsContainer>
                                {attributeGradeToAnswerActions.map(
                                    (attributeGradeToAnswerAction) => {
                                        const { IconComponent, color, grade } =
                                            attributeGradeToAnswerAction;
                                        const adjective =
                                            gradeConverter.convertGradeToAdjective(grade);
                                        const chunk =
                                            props.displayedAnswer.title[
                                                currentChunkMenu.chunkIndex
                                            ];
                                        if (chunk.kind !== 'coloredText') {
                                            return <div />;
                                        }

                                        const blankIndex = convertChunkIndexToBlankIndex(
                                            currentChunkMenu.chunkIndex,
                                        );

                                        const isButtonDisabled =
                                            !computeCanTexteATrousAnswerBeAttributed(
                                                grade,
                                                chunk.grade,
                                                blankIndex,
                                                props.question,
                                            );
                                        const loadingInfo = {
                                            addAcceptableAnswer:
                                                addQuestionAcceptableAnswerToTexteATrousMutation.isPending
                                                    ? addQuestionAcceptableAnswerToTexteATrousMutation
                                                          .variables.acceptableAnswer.grade
                                                    : undefined,
                                            removeOkAnswer:
                                                removeOkAnswerFromTexteATrousMutation.isPending,
                                        };
                                        const isButtonLoading =
                                            computeIsTexteATrousUpdateAnswerButtonLoading(
                                                grade,
                                                loadingInfo,
                                            );

                                        return (
                                            <IconButton
                                                IconComponent={IconComponent}
                                                onClick={buildAttributeGradeToTatAnswer({
                                                    grade,
                                                    chunkIndex: currentChunkMenu.chunkIndex,
                                                })}
                                                size="small"
                                                color={color}
                                                disabled={isButtonDisabled || isButtonLoading}
                                                title={`Marquer comme ${adjective}`}
                                            />
                                        );
                                    },
                                )}
                            </IconsContainer>
                            <Typography>
                                {computeBlankMark(currentChunkMenu.chunkIndex)} / {pointsPerBlank}
                            </Typography>
                        </MenuContentContainer>
                    )}
                </Menu>
            )}
            <Title>
                {props.index}.{' '}
                {props.displayedAnswer.title.map((chunk, chunkIndex) => {
                    switch (chunk.kind) {
                        case 'text':
                            return <span>{chunk.value}</span>;
                        case 'coloredText':
                            const StyledComponent = styledContainerMapping[chunk.status || 'wrong'];
                            return (
                                <>
                                    <StyledComponent onClick={buildHandleChunkClick(chunkIndex)}>
                                        {' '}
                                        {chunk.value}{' '}
                                    </StyledComponent>
                                </>
                            );
                        default:
                            return <span />;
                    }
                })}
            </Title>
        </Container>
    );

    function closeChunkMenu() {
        setCurrentChunkMenu(null);
    }

    function computeBlankMark(chunkIndex: number) {
        const chunk = props.displayedAnswer.title[chunkIndex];
        if (chunk.kind !== 'coloredText') {
            return 0;
        }
        const blankMark = gradeConverter.convertGradeToMark(chunk.grade, pointsPerBlank) || 0;
        return blankMark;
    }

    function buildAttributeGradeToTatAnswer(body: { grade: gradeType; chunkIndex: number }) {
        const answer = props.displayedAnswer.title[body.chunkIndex].value;
        const blankIndex = convertChunkIndexToBlankIndex(body.chunkIndex);
        return () => {
            if (props.attemptStatus === 'corrected') {
                displayAlert({
                    variant: 'error',
                    text: 'Cette copie est marquée comme corrigée, vous ne pouvez plus modifier la note.',
                });
                return;
            }
            if (body.grade === 'E') {
                removeOkAnswerFromTexteATrousMutation.mutate({
                    examId: props.examId,
                    questionId: props.question.id,
                    okAnswer: answer,
                    blankIndex,
                });
            } else {
                addQuestionAcceptableAnswerToTexteATrousMutation.mutate({
                    examId: props.examId,
                    questionId: props.question.id,
                    acceptableAnswer: { grade: body.grade, answer },
                    blankIndex,
                });
            }
        };
    }

    function buildHandleChunkClick(chunkIndex: number) {
        return (event: React.MouseEvent<HTMLElement>) => {
            setCurrentChunkMenu({ element: event.currentTarget, chunkIndex });
        };
    }

    function convertChunkIndexToBlankIndex(chunkIndex: number) {
        let blankIndex = 0;
        for (let i = 0; i < props.displayedAnswer.title.length; i++) {
            const chunk = props.displayedAnswer.title[i];

            if (i === chunkIndex) {
                return blankIndex;
            }
            if (chunk.kind === 'coloredText') {
                blankIndex++;
            }
        }
        return blankIndex;
    }
}

const Title = styled(Typography)({ fontWeight: 'bold' });

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

const MenuContentContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});
const IconsContainer = styled('div')({ display: 'flex' });

export { TexteATrousChecking };
