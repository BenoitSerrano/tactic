import React from 'react';
import { examAdaptator } from '../modules/exams/adaptator';

function Home() {
    const exam = examAdaptator.fetchQuestions();

    return (
        <div>
            {exam.map(({ id, title, possibleAnswers }) => (
                <div key={id}>
                    <h2>{title}</h2>
                    <div>
                        {possibleAnswers.map((possibleAnswer) => (
                            <div key={possibleAnswer}>
                                <input
                                    type="radio"
                                    id={possibleAnswer}
                                    name={id}
                                    value={possibleAnswer}
                                />
                                <label htmlFor={possibleAnswer}>{possibleAnswer}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export { Home };
