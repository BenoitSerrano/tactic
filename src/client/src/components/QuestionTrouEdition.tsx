import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { debounce } from '../lib/utils';
import { api } from '../lib/api';

function QuestionTrouEdition(props: {
    examId: string;
    questionTrou: {
        beforeText: string;
        afterText: string;
        acceptableAnswers: string[];
        rightAnswer: string;
        order: number;
    };
}) {
    const [rightAnswer, setRightAnswer] = useState(props.questionTrou.rightAnswer);

    const [beforeText, setBeforeText] = useState(props.questionTrou.beforeText);
    const [afterText, setAfterText] = useState(props.questionTrou.afterText);

    const updateQcmMutation = useMutation({
        mutationFn: api.updateQuestionChoixMultiple,
    });

    return (
        <div>
            <strong>{props.questionTrou.order + 1}.</strong>
            <input
                value={beforeText}
                placeholder="Texte avant le trou"
                onChange={onChangeBeforeText}
            />
        </div>
    );

    function onChangeBeforeText(event: React.ChangeEvent<HTMLInputElement>) {
        setBeforeText(event.target.value);
        // debounce((newBeforeText: string) =>
        //     updateQcmMutation.mutate({
        //         examId: props.examId,
        //         qcmId: props.questionChoixMultiple.id,
        //         rightAnswerIndex: rightAnswerIndex,
        //         title: newTitle,
        //         possibleAnswers,
        //     }),
        // )(event.target.value);
    }
}

export { QuestionTrouEdition };
