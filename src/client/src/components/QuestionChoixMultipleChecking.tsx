import React from 'react';

function QuestionChoixMultipleChecking(props: {
    questionChoixMultiple: {
        id: number;
        title: string;
        possibleAnswers: string[];
        choice: number;
    };
    index: number;
    attemptId: string;
}) {
    const qcmId = props.questionChoixMultiple.id;

    return (
        <div key={qcmId}>
            <h2>
                {props.index + 1}. {props.questionChoixMultiple.title}
            </h2>
            {props.questionChoixMultiple.possibleAnswers.map(
                (possibleAnswer: any, index: number) => (
                    <React.Fragment key={`${props.questionChoixMultiple.id}-${index}`}>
                        <input
                            type="radio"
                            id={`${qcmId}-${index}`}
                            name={`${props.questionChoixMultiple.id}`}
                            value={possibleAnswer}
                            disabled
                            checked={props.questionChoixMultiple.choice === index}
                        />
                        <label htmlFor={`${qcmId}-${index}`}>{possibleAnswer}</label>
                    </React.Fragment>
                ),
            )}
        </div>
    );
}

export { QuestionChoixMultipleChecking };
