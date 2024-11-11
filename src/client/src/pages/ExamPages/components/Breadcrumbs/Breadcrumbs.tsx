import { Breadcrumbs as MuiBreadcrumbs, Typography, styled } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { computeBreadcrumbs } from './computeBreadcrumbs';
import { establishmentWithClassesType } from '../../../../lib/api/api';

function Breadcrumbs(props: { establishments: establishmentWithClassesType[] }) {
    const location = useLocation();
    const breadcrumbs = computeBreadcrumbs(location.pathname, props.establishments);
    return (
        <MainContainer>
            <MuiBreadcrumbs>
                {breadcrumbs.map((breadcrumb) =>
                    breadcrumb.href ? (
                        <Link key={breadcrumb.label} to={breadcrumb.href}>
                            {breadcrumb.label}
                        </Link>
                    ) : (
                        <Typography key={breadcrumb.label}>{breadcrumb.label}</Typography>
                    ),
                )}
            </MuiBreadcrumbs>
        </MainContainer>
    );
}

const MainContainer = styled('div')(({ theme }) => ({ padding: theme.spacing(2), flex: 1 }));
export { Breadcrumbs };
