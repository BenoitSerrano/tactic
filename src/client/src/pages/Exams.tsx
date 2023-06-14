import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.getExams });

    return (
        <div>
            <ul>
                {query.data?.map((exam: any) => {
                    return (
                        <li key={exam.id}>
                            <Link to={`/examens/${exam.id}`}>{exam.name}</Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export { Exams };
