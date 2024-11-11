import { Breadcrumbs as MuiBreadcrumbs, Typography, styled } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { computeBreadcrumbs } from './computeBreadcrumbs';
import { establishmentWithClassesType } from '../../lib/api/api';
import { BREADCRUMBS_HEIGHT } from '../../constants';

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

const Placeholder = styled('div')({ height: BREADCRUMBS_HEIGHT });
const MainContainer = styled('div')(({ theme }) => ({
    maxHeight: BREADCRUMBS_HEIGHT,
    minHeight: BREADCRUMBS_HEIGHT,
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}));
export { Breadcrumbs };
