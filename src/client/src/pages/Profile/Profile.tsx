import { styled, Typography } from '@mui/material';
import { packagesApi } from '../../lib/api/packagesApi';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../../components/Loader';
import { Button } from '../../components/Button';
import { pathHandler } from '../../lib/pathHandler';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const packagesQuery = useQuery({
        queryKey: ['packages'],
        queryFn: packagesApi.getPackages,
    });
    const navigate = useNavigate();

    if (!packagesQuery.data) {
        if (packagesQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <Container>
            <Title variant="h2">Recharger</Title>
            <PackagesContainer>
                {packagesQuery.data.packages.map((pack) => (
                    <PackageContainer key={pack.id}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={buildNavigateToPaymentStart(pack.id)}
                        >
                            <PackageTitle>
                                {pack.paperCount} copies pour {pack.price} €
                            </PackageTitle>
                        </Button>
                    </PackageContainer>
                ))}
            </PackagesContainer>
        </Container>
    );

    function buildNavigateToPaymentStart(packageId: string) {
        return () => {
            navigate(pathHandler.getRoutePath('PAYMENT_START', { packageId }));
        };
    }
}

const Container = styled('div')(({ theme }) => ({ padding: theme.spacing(2) }));
const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(2) }));
const PackagesContainer = styled('div')(({ theme }) => ({ display: 'flex' }));
const PackageContainer = styled('div')(({ theme }) => ({
    flex: 1,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
}));
const PackageTitle = styled(Typography)(({ theme }) => ({}));
export { Profile };
