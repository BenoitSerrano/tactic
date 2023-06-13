import React from 'react';
import { examAdaptator } from '../modules/exams/adaptator';

function Home() {
    const exam = examAdaptator.fetch();

    return (
        <div>
            {exam.map(({ question, possibilities }, index) => (
                <p>
                    <h2>{question}</h2>
                    <div>
                        {possibilities.map((possibility) => (
                            <div key={possibility}>
                                <input
                                    type="radio"
                                    id={possibility}
                                    name={question}
                                    value={possibility}
                                />
                                <label htmlFor={possibility}>{possibility}</label>
                            </div>
                        ))}
                    </div>
                </p>
            ))}
        </div>
    );
}

export { Home };
