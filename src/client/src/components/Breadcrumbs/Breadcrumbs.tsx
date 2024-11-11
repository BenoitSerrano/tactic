import { Breadcrumbs as MuiBreadcrumbs, Typography, styled } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { computeBreadcrumbs } from './computeBreadcrumbs';
import { establishmentWithClassesType } from '../../lib/api/api';

const HEIGHT = 60;

function Breadcrumbs(props: { establishments: establishmentWithClassesType[] }) {
    const location = useLocation();
    const breadcrumbs = computeBreadcrumbs(location.pathname, props.establishments);
    return breadcrumbs.length > 0 ? (
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
    ) : (
        <Placeholder />
    );
}

const Placeholder = styled('div')({ height: HEIGHT });
const MainContainer = styled('div')(({ theme }) => ({
    maxHeight: HEIGHT,
    minHeight: HEIGHT,
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}));
export { Breadcrumbs };
