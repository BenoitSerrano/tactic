import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function StudentAction() {
    const navigate = useNavigate();
    const params = useParams();
    const examId = params.examId as string;
    const studentId = params.studentId as string;

    return (
        <div>
            <button onClick={launchExam}>Lancer l'examen</button>
        </div>
    );

    function launchExam() {
        navigate(`/student/exams/${examId}/students/${studentId}/take`);
    }
}

export { StudentAction };
