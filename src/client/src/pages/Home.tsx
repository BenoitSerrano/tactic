import React from 'react';
import { examAdaptator } from '../modules/exams/adaptator';

function Home() {
    const exam = examAdaptator.fetch();

    return (
        <div>
            {exam.map(({ question, possibilities }, index) => (
                <p>
                    <h2>{question}</h2>
                    <ul>
                        {possibilities.map((possibility) => (
                            <li>{possibility}</li>
                        ))}
                    </ul>
                </p>
            ))}
        </div>
    );
}

export { Home };
