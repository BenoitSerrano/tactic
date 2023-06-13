import React, { useState } from 'react';
import { examType } from '../types';
import { examAdaptator } from '../modules/exams/adaptator';

function ExamCreation() {
    const examId = 'mon-examen';
    const storedExam = examAdaptator.findExam(examId);

    const [exam, setExam] = useState<examType>(storedExam);
    return (
        <div>
            {exam.questions.map((question) => (
                <div>
                    <p>Intitulé: {question.title}</p>
                    <p>
                        Réponses possibles:
                        <ul>
                            {question.possibleAnswers.map((possibleAnswer, index) => (
                                <li>
                                    {index === exam.solution[question.id] ? (
                                        <strong>{possibleAnswer}</strong>
                                    ) : (
                                        possibleAnswer
                                    )}
                                </li>
                            ))}
                        </ul>
                    </p>
                </div>
            ))}
            <button onClick={addNewQuestion}>Ajouter une nouvelle question</button>
        </div>
    );

    function addNewQuestion() {}
}

export { ExamCreation };
