import { styled, Typography } from '@mui/material';

function PageTitle(props: { title: string; IconComponent?: React.ReactNode }) {
    const { title, IconComponent } = props;
    return (
        <Title variant="h3">
            {!!IconComponent && <IconContainer>{IconComponent}</IconContainer>}
            {title}
        </Title>
    );
}
const Title = styled(Typography)(({ theme }) => ({ display: 'flex', alignItems: 'center' }));
const IconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
}));
export { PageTitle };
