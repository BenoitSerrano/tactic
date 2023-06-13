import React, { useState } from 'react';
import { examType } from '../types';
import { examAdaptator } from '../modules/exams/adaptator';

function ExamCreation() {
    const examId = 'mon-examen';
    const storedExam = examAdaptator.findExam(examId);

    const [exam, setExam] = useState<examType>(storedExam);

    return (
        <div>
            {exam.questions.map((question, questionIndex) => (
                <div>
                    <p>
                        Intitulé:
                        <input
                            value={question.title}
                            onChange={(event) =>
                                setQuestionTitle(questionIndex, event.target.value)
                            }
                        />
                    </p>
                    <p>
                        Réponses possibles:
                        {question.possibleAnswers.map((possibleAnswer, possibleAnswerIndex) => {
                            const isRightAnswer =
                                possibleAnswerIndex === exam.solution[question.id];
                            return (
                                <p>
                                    <input
                                        type="radio"
                                        id={possibleAnswer}
                                        name={question.id}
                                        value={possibleAnswer}
                                        checked={isRightAnswer}
                                        onClick={() => {}}
                                    />
                                    <input
                                        value={possibleAnswer}
                                        onChange={(event) =>
                                            setQuestionPossibleAnswer(
                                                questionIndex,
                                                possibleAnswerIndex,
                                                event.target.value,
                                            )
                                        }
                                    />
                                </p>
                            );
                        })}
                    </p>
                </div>
            ))}
            <button onClick={addNewQuestion}>Ajouter une nouvelle question</button>
            <button onClick={saveExam}>Sauvegarder les changements</button>
        </div>
    );

    function setQuestionTitle(index: number, newTitle: string) {
        setExam({
            ...exam,
            questions: [
                ...exam.questions.slice(0, index),
                { ...exam.questions[index], title: newTitle },
                ...exam.questions.slice(index + 1),
            ],
        });
    }

    function setQuestionPossibleAnswer(
        questionIndex: number,
        possibleAnswerIndex: number,
        newPossibleAnswer: string,
    ) {
        setExam({
            ...exam,
            questions: [
                ...exam.questions.slice(0, questionIndex),
                {
                    ...exam.questions[questionIndex],
                    possibleAnswers: [
                        ...exam.questions[questionIndex].possibleAnswers.slice(
                            0,
                            possibleAnswerIndex,
                        ),
                        newPossibleAnswer,
                        ...exam.questions[questionIndex].possibleAnswers.slice(
                            possibleAnswerIndex + 1,
                        ),
                    ],
                },
                ...exam.questions.slice(questionIndex + 1),
            ],
        });
    }

    function addNewQuestion() {}

    function saveExam() {
        examAdaptator.updateExam(examId, exam.questions, exam.solution);
    }
}

export { ExamCreation };
