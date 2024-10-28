import { Breadcrumbs as MuiBreadcrumbs, Typography, styled } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { computeBreadcrumbs } from './computeBreadcrumbs';

function Breadcrumbs() {
    const location = useLocation();
    const breadcrumbs = computeBreadcrumbs(location.pathname);
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

const MainContainer = styled('div')({ padding: 20 });
export { Breadcrumbs };
