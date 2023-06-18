import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

function StudentAuthentication() {
    const query = useQuery({ queryKey: ['students'], queryFn: api.fetchStudents });
    const params = useParams();
    const examId = params.examId as string;

    return (
        <div>
            <ul>
                {query.data?.map(
                    (student: {
                        id: string;
                        email: string;
                        attempts: Array<{ id: string; exam: { id: string; name: string } }>;
                    }) => {
                        const currentAttempt = student.attempts.find(
                            (attempt) => attempt.exam.id === examId,
                        );
                        const to = currentAttempt
                            ? `/student/attempts/${currentAttempt.id}`
                            : `/student/exams/${examId}/students/${student.id}`;
                        return (
                            <li key={student.id}>
                                <Link key={student.id} to={to}>
                                    {student.email}
                                </Link>
                            </li>
                        );
                    },
                )}
            </ul>
        </div>
    );
}

export { StudentAuthentication };
