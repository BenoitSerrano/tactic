import React, { useState } from 'react';
import { examAdaptator } from '../modules/exams/adaptator';

function Home() {
    const exam = examAdaptator.fetchQuestions();
    const [trial, setTrial] = useState({});

    return (
        <div>
            {exam.map(({ id, title, possibleAnswers }) => (
                <div key={id}>
                    <h2>{title}</h2>
                    <div>
                        {possibleAnswers.map((possibleAnswer, index) => (
                            <div key={possibleAnswer}>
                                <input
                                    type="radio"
                                    id={possibleAnswer}
                                    name={id}
                                    value={possibleAnswer}
                                    onClick={() => setTrial({ ...trial, [id]: index })}
                                />
                                <label htmlFor={possibleAnswer}>{possibleAnswer}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button onClick={submitTrial}>Valider</button>
        </div>
    );

    function submitTrial() {
        console.log(trial);
    }
}

export { Home };
