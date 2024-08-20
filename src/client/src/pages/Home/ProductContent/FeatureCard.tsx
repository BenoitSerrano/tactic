import { styled, Typography } from '@mui/material';
import { Card } from '../../../components/Card';

function FeatureCard(props: { title: string; description: string }) {
    return (
        <CardContainer>
            <Card style={{ flex: 1 }}>
                <Title variant="h4">{props.title}</Title>
                <Description variant="h5">{props.description}</Description>
            </Card>
        </CardContainer>
    );
}

const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const Description = styled(Typography)(({ theme }) => ({}));
const CardContainer = styled('div')(({ theme }) => ({ display: 'flex', width: '25%' }));
export { FeatureCard };
