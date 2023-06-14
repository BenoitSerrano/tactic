import React from 'react';

function QuestionEdition(props: { questionChoixMultiple: any }) {
    console.log(props);
    return (
        <div>
            <input
                value={props.questionChoixMultiple.title}
                placeholder="Intitulé de la question"
            />
            {props.questionChoixMultiple.possibleAnswers.map(
                (possibleAnswer: string, possibleAnswerIndex: number) => {
                    const isRightAnswer =
                        possibleAnswerIndex === props.questionChoixMultiple.rightAnswerIndex;
                    return (
                        <React.Fragment key={possibleAnswer}>
                            <input
                                type="radio"
                                id={possibleAnswer}
                                name={props.questionChoixMultiple.id}
                                value={possibleAnswer}
                                checked={isRightAnswer}
                                onChange={() => {}}
                            />
                            <input value={possibleAnswer} onChange={() => {}} />
                        </React.Fragment>
                    );
                },
            )}
        </div>
    );
}

export { QuestionEdition };
