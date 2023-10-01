import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { debounce } from '../../lib/utils';
import { api } from '../../lib/api';
import { TextField, Typography, styled } from '@mui/material';
import { useTimeoutAlert } from './useTimeoutAlert';
import { questionTrouType } from './types';

function QuestionTrouAnswering(props: {
    questionTrou: questionTrouType;
    index: number;
    attemptId: string;
}) {
    const [answer, setAnswer] = useState(props.questionTrou.answer);
    const { displayTimeoutAlert } = useTimeoutAlert();
    const queryClient = useQueryClient();

    const createOrUpdateQuestionTrouAnswerMutation = useMutation({
        mutationFn: api.createOrUpdateQuestionTrouAnswer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts-without-answers'] });
        },
        onError: async (error) => {
            console.warn(error);
            displayTimeoutAlert();
        },
    });

    return (
        <StyledContainer>
            <Typography>
                {props.index + 1}. {props.questionTrou.beforeText}
            </Typography>
            <StyledTextField value={answer} onChange={onChangeAnswer} placeholder="..." />
            <Typography>{props.questionTrou.afterText}</Typography>
        </StyledContainer>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setAnswer(event.target.value);

        debounce((newAnswer: string) => {
            return createOrUpdateQuestionTrouAnswerMutation.mutate({
                attemptId: props.attemptId,
                questionTrouId: props.questionTrou.id,
                answer: newAnswer,
            });
        })(event.target.value);
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
});

const StyledTextField = styled(TextField)({
    marginLeft: '5px',
    marginRight: '5px',
});
export { QuestionTrouAnswering };
