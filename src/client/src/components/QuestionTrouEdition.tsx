import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { debounce } from '../lib/utils';
import { api } from '../lib/api';
import { TextField } from '@mui/material';
import { splitQuestionTrou } from '../lib/splitQuestionTrou';

function QuestionTrouEdition(props: {
    examId: string;
    questionTrou: {
        id: number;
        beforeText: string;
        afterText: string;
        acceptableAnswers: string[];
        rightAnswer: string;
        order: number;
    };
}) {
    const [rightAnswer, setRightAnswer] = useState(props.questionTrou.rightAnswer);
    const [acceptableAnswers, setAcceptableAnswers] = useState(
        props.questionTrou.acceptableAnswers.join(','),
    );
    const [questionText, setQuestionText] = useState(
        `${props.questionTrou.beforeText} ......... ${props.questionTrou.afterText}`,
    );
    const [questionTextError, setQuestionTextError] = useState(false);

    const updateQuestionTrouMutation = useMutation({
        mutationFn: api.updateQuestionTrou,
    });

    return (
        <div>
            <p>{props.questionTrou.order + 1}.</p>
            <TextField
                error={questionTextError}
                fullWidth
                label="Question"
                value={questionText}
                onChange={onChangeQuestionText}
                placeholder="Ecrivez le texte de la question"
            />
            <TextField
                label="Bonne réponse"
                placeholder="Ecrivez la bonne réponse"
                value={rightAnswer}
                onChange={onChangeRightAnswer}
            />
            <TextField
                fullWidth
                label="Réponses acceptables"
                placeholder="Ecrivez les réponses acceptables, séparées par des virgules"
                value={acceptableAnswers}
                onChange={onChangeAcceptableAnswers}
            />
        </div>
    );

    function onChangeQuestionText(event: React.ChangeEvent<HTMLInputElement>) {
        setQuestionText(event.target.value);

        debounce((newQuestionText: string) => {
            const result = splitQuestionTrou(newQuestionText);
            let beforeText = '',
                afterText = '';
            if (result === undefined) {
                setQuestionTextError(true);
                return;
            } else {
                if (questionTextError) {
                    setQuestionTextError(false);
                }
                beforeText = result.beforeText;
                afterText = result.afterText;
            }
            return updateQuestionTrouMutation.mutate({
                examId: props.examId,
                questionTrouId: props.questionTrou.id,
                beforeText,
                afterText,
            });
        })(event.target.value);
    }

    function onChangeRightAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setRightAnswer(event.target.value);

        debounce((newRightAnswer: string) => {
            return updateQuestionTrouMutation.mutate({
                examId: props.examId,
                questionTrouId: props.questionTrou.id,
                rightAnswer: newRightAnswer,
            });
        })(event.target.value);
    }

    function onChangeAcceptableAnswers(event: React.ChangeEvent<HTMLInputElement>) {
        setAcceptableAnswers(event.target.value);

        debounce((newAcceptableAnswers: string) => {
            return updateQuestionTrouMutation.mutate({
                examId: props.examId,
                questionTrouId: props.questionTrou.id,
                acceptableAnswers: newAcceptableAnswers
                    .split(',')
                    .map((acceptableAnswer) => acceptableAnswer.trim()),
            });
        })(event.target.value);
    }
}

export { QuestionTrouEdition };
