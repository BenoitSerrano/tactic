import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link, useParams } from 'react-router-dom';

function StudentAuthentication() {
    const query = useQuery({ queryKey: ['students'], queryFn: api.fetchStudents });
    const params = useParams();
    const examId = params.examId as string;

    return (
        <div>
            <ul>
                {query.data?.map((student: any) => (
                    <li>
                        <Link
                            key={student.id}
                            to={`/student/exams/${examId}/students/${student.id}`}
                        >
                            {student.firstName} {student.lastName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { StudentAuthentication };
