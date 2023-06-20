import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { debounce } from '../lib/utils';
import { api } from '../lib/api';
import { TextField } from '@mui/material';

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

    const [beforeText, setBeforeText] = useState(props.questionTrou.beforeText);
    const [afterText, setAfterText] = useState(props.questionTrou.afterText);

    const updateQuestionTrouMutation = useMutation({
        mutationFn: api.updateQuestionTrou,
    });

    return (
        <div>
            <p>{props.questionTrou.order + 1}.</p>
            <div>
                <TextField
                    fullWidth
                    label="Début du texte..."
                    value={beforeText}
                    onChange={onChangeBeforeText}
                    placeholder="Début du texte..."
                />
                <TextField
                    fullWidth
                    label="... suite du texte"
                    value={afterText}
                    onChange={onChangeAfterText}
                    placeholder="... suite du texte"
                />
            </div>
            <TextField
                fullWidth
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

    function onChangeBeforeText(event: React.ChangeEvent<HTMLInputElement>) {
        setBeforeText(event.target.value);

        debounce((newBeforeText: string) => {
            return updateQuestionTrouMutation.mutate({
                examId: props.examId,
                questionTrouId: props.questionTrou.id,
                beforeText: newBeforeText,
            });
        })(event.target.value);
    }

    function onChangeAfterText(event: React.ChangeEvent<HTMLInputElement>) {
        setAfterText(event.target.value);

        debounce((newAfterText: string) => {
            return updateQuestionTrouMutation.mutate({
                examId: props.examId,
                questionTrouId: props.questionTrou.id,
                afterText: newAfterText,
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
