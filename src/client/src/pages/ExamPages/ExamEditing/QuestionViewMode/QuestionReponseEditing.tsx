import { TextField, Typography, styled } from '@mui/material';
import { formErrorHandler } from '../lib/formErrorHandler';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SchoolIcon from '@mui/icons-material/School';

import { FormHelperText } from '../../../../components/FormHelperText';
import {
    okGradeType,
    okGrades,
    rightGradeType,
    rightGrades,
    textComponentMapping,
} from './constants';
import {
    aggregateAcceptableAnswersByGrade,
    aggregatedAcceptableAnswerType,
} from '../lib/aggregateAcceptableAnswersByGrade';
import { acceptableAnswerType } from '../../../../types';
import { RemoveButton } from './Buttons';
import { Button } from '../../../../components/Button';
import { VeryLightHorizontalDivider } from '../../../../components/HorizontalDivider';
import { ChangeEvent } from 'react';
import { gradeConverter } from '../../../../lib/gradeConverter';
import { GradeExplanationIcon } from './GradeExplanationIcon';

function QuestionReponseEditing(props: {
    index: number;
    formErrors: string[];
    shouldDisplayErrors: boolean;
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
}) {
    const titleFormErrorMessage = formErrorHandler.extractTitleFormErrorMessage(props.formErrors);
    const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(props.acceptableAnswers);

    const areThereOkAnswers = okGrades.some(
        (okGrade) => aggregatedAcceptableAnswers[okGrade].length > 0,
    );
    const acceptableAnswerGradesToEdit = areThereOkAnswers
        ? [...rightGrades, ...okGrades]
        : [...rightGrades];
    return (
        <Container>
            <TitleContainer>
                <TextField
                    error={props.shouldDisplayErrors && titleFormErrorMessage !== undefined}
                    helperText={
                        props.shouldDisplayErrors && (
                            <FormHelperText label={titleFormErrorMessage} />
                        )
                    }
                    fullWidth
                    label="Intitulé"
                    placeholder="Intitulé de la question"
                    value={props.title}
                    variant="standard"
                    onChange={(event) => props.setTitle(event.target.value)}
                />
            </TitleContainer>
            <AcceptableAnswersContainer>
                {acceptableAnswerGradesToEdit.map((grade, gradeIndex) => {
                    return (
                        <>
                            {renderAnswersToEdit(grade, aggregatedAcceptableAnswers[grade])}
                            {gradeIndex < acceptableAnswerGradesToEdit.length - 1 && (
                                <VeryLightHorizontalDivider />
                            )}
                        </>
                    );
                })}
            </AcceptableAnswersContainer>
        </Container>
    );

    function renderAnswersToEdit(
        grade: rightGradeType | okGradeType,
        acceptableAnswers: aggregatedAcceptableAnswerType[],
    ) {
        const pluralAdjective = gradeConverter.convertGradeToAdjective(grade, { isPlural: true });
        const singularAdjective = gradeConverter.convertGradeToAdjective(grade, {
            isPlural: false,
        });
        const canRemoveAcceptableAnswer = computeCanRemoveAcceptableAnswer(grade);
        const TextComponent = textComponentMapping[grade];
        return (
            <GradeAcceptableAnswersContainer>
                <AcceptableAnswersCaption>
                    <TextComponent>
                        Réponses {pluralAdjective} <GradeExplanationIcon grade={grade} /> :
                    </TextComponent>
                </AcceptableAnswersCaption>
                {acceptableAnswers.map((acceptableAnswer) => {
                    const formErrorMessage =
                        formErrorHandler.extractAcceptableAnswerEmptyFormErrorMessage(
                            props.formErrors,
                            acceptableAnswer.index,
                        );
                    return (
                        <AcceptableAnswerRow
                            key={`acceptableAnswer-${grade}-${acceptableAnswer.index}`}
                        >
                            <TextField
                                error={props.shouldDisplayErrors && !!formErrorMessage}
                                helperText={
                                    props.shouldDisplayErrors && (
                                        <FormHelperText label={formErrorMessage} />
                                    )
                                }
                                fullWidth
                                variant="standard"
                                value={acceptableAnswer.answer}
                                label="Réponse"
                                onChange={buildOnChangeAcceptableAnswer(acceptableAnswer.index)}
                            />
                            <RemoveButton
                                disabled={!canRemoveAcceptableAnswer}
                                onClick={buildRemoveAcceptableAnswer(acceptableAnswer)}
                            />
                        </AcceptableAnswerRow>
                    );
                })}
                <AddAcceptableAnswerRow>
                    <Button
                        onClick={buildAddAcceptableAnswer(grade)}
                        variant="outlined"
                        color="inherit"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Ajouter une réponse {singularAdjective}
                    </Button>
                </AddAcceptableAnswerRow>
            </GradeAcceptableAnswersContainer>
        );
    }

    function computeCanRemoveAcceptableAnswer(grade: rightGradeType | okGradeType) {
        if (grade === 'A') {
            return aggregatedAcceptableAnswers[grade].length > 1;
        }
        return true;
    }

    function buildOnChangeAcceptableAnswer(acceptableAnswerIndex: number) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const currentAcceptableAnswer = props.acceptableAnswers[0][acceptableAnswerIndex];
            const newAcceptableAnswers = [...props.acceptableAnswers[0]];
            newAcceptableAnswers[acceptableAnswerIndex] = {
                grade: currentAcceptableAnswer.grade,
                answer: event.target.value,
            };
            props.setAcceptableAnswers([newAcceptableAnswers]);
        };
    }

    function buildAddAcceptableAnswer(grade: rightGradeType | okGradeType) {
        return () => {
            const newAcceptableAnswers: acceptableAnswerType[] = [
                ...props.acceptableAnswers[0],
                { answer: '', grade },
            ];
            props.setAcceptableAnswers([newAcceptableAnswers]);
        };
    }

    function buildRemoveAcceptableAnswer(acceptableAnswer: aggregatedAcceptableAnswerType) {
        return () => {
            const newAcceptableAnswers = [...props.acceptableAnswers[0]];
            newAcceptableAnswers.splice(acceptableAnswer.index, 1);
            props.setAcceptableAnswers([newAcceptableAnswers]);
        };
    }
}

const Container = styled('div')({ width: '100%' });
const TitleContainer = styled('div')({
    display: 'flex',
    alignItems: 'baseline',
});
const AcceptableAnswersContainer = styled('div')({ display: 'flex', flexDirection: 'column' });
const GradeAcceptableAnswersContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
const AcceptableAnswerRow = styled('div')({ display: 'flex', alignItems: 'center' });
const AcceptableAnswersCaption = styled(Typography)({});
const AddAcceptableAnswerRow = styled('div')({ display: 'flex', justifyContent: 'flex-end' });

export { QuestionReponseEditing };
