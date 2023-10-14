import React from 'react';
import { colorLib } from '../../lib/colors';
import { Typography, styled } from '@mui/material';

function QuestionChecking(props: {
    question: {
        id: number;
        title: string;
        kind: 'qcm' | 'questionTrou' | 'phraseMelangee';
        possibleAnswers: string[] | null;
        answer: string | undefined;
        status: 'right' | 'wrong' | 'acceptable';
    };
    index: number;
}) {
    const color = colorLib.computeTextColor(props.question.status);
    const StyledContainer = styled('div')({ color });
    let answer = '';
    if (props.question.answer !== undefined) {
        if (props.question.kind === 'qcm' && props.question.possibleAnswers !== null) {
            answer = props.question.possibleAnswers[Number(props.question.answer)];
        } else {
            answer = props.question.answer;
        }
    }

    return (
        <StyledContainer>
            <Typography>
                {props.index}. Intitulé : {props.question.title}
            </Typography>
            {props.question.possibleAnswers?.length && (
                <Typography>
                    Réponses proposées :
                    <ul>
                        {props.question.possibleAnswers.map((possibleAnswer) => (
                            <li key={possibleAnswer}>{possibleAnswer}</li>
                        ))}
                    </ul>
                </Typography>
            )}
            <Typography>Réponse : {answer}</Typography>
        </StyledContainer>
    );
}

export { QuestionChecking };
