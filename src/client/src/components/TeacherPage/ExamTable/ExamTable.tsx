import { styled, Typography } from '@mui/material';

import { examApiType } from '../../../pages/Classe/types';
import { ExamRow } from './ExamRow';

function ExamTable(props: {
    establishmentId: string;
    classeId: string;
    exams: examApiType[];
    title: string;
}) {
    return (
        <Container>
            <TitleContainer>
                <Typography variant="h3">{props.title}</Typography>
            </TitleContainer>

            {props.exams.map((exam) => (
                <ExamRowContainer>
                    <ExamRow
                        exam={exam}
                        classeId={props.classeId}
                        establishmentId={props.establishmentId}
                    />
                </ExamRowContainer>
            ))}
        </Container>
    );
}

const TitleContainer = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const Container = styled('div')(({ theme }) => ({}));
const ExamRowContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
}));
export { ExamTable };
