import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { debounce } from '../../lib/utils';
import { api } from '../../lib/api';

function QuestionChoixMultipleEdition(props: { examId: string; questionChoixMultiple: any }) {
    const [title, setTitle] = useState(props.questionChoixMultiple.title);
    const [rightAnswerIndex, setRightAnswerIndex] = useState(
        props.questionChoixMultiple.rightAnswerIndex,
    );
    const [possibleAnswers, setPossibleAnswers] = useState(
        props.questionChoixMultiple.possibleAnswers,
    );

    const updateQcmMutation = useMutation({
        mutationFn: api.updateQuestionChoixMultiple,
    });

    return (
        <div>
            <strong>{props.questionChoixMultiple.order + 1}.</strong>
            <input value={title} placeholder="Intitulé de la question" onChange={onChangeTitle} />
            {possibleAnswers.map((possibleAnswer: string, possibleAnswerIndex: number) => {
                const isRightAnswer = possibleAnswerIndex === rightAnswerIndex;
                return (
                    <React.Fragment key={possibleAnswerIndex}>
                        <input
                            type="radio"
                            id={possibleAnswer}
                            name={`${props.examId}-${props.questionChoixMultiple.id}`}
                            value={possibleAnswer}
                            checked={isRightAnswer}
                            onChange={() => onChangeRightAnswerIndex(possibleAnswerIndex)}
                        />
                        <input
                            value={possibleAnswer}
                            onChange={buildOnChangePossibleAnswer(possibleAnswerIndex)}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );

    function onChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value);
        debounce((newTitle: string) =>
            updateQcmMutation.mutate({
                examId: props.examId,
                qcmId: props.questionChoixMultiple.id,
                rightAnswerIndex: rightAnswerIndex,
                title: newTitle,
                possibleAnswers,
            }),
        )(event.target.value);
    }

    function onChangeRightAnswerIndex(newRightAnswerIndex: number) {
        setRightAnswerIndex(newRightAnswerIndex);
        updateQcmMutation.mutate({
            examId: props.examId,
            qcmId: props.questionChoixMultiple.id,
            rightAnswerIndex: newRightAnswerIndex,
            title: title,
            possibleAnswers,
        });
    }

    function buildOnChangePossibleAnswer(possibleAnswerIndex: number) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.indexOf(',') !== -1) {
                return;
            }
            setPossibleAnswers([
                ...possibleAnswers.slice(0, possibleAnswerIndex),
                event.target.value,
                ...possibleAnswers.slice(possibleAnswerIndex + 1),
            ]);
            debounce((newPossibleAnswer: string) =>
                updateQcmMutation.mutate({
                    examId: props.examId,
                    qcmId: props.questionChoixMultiple.id,
                    rightAnswerIndex: rightAnswerIndex,
                    title: title,
                    possibleAnswers: [
                        ...possibleAnswers.slice(0, possibleAnswerIndex),
                        newPossibleAnswer,
                        ...possibleAnswers.slice(possibleAnswerIndex + 1),
                    ],
                }),
            )(event.target.value);
        };
    }
}

export { QuestionChoixMultipleEdition };
