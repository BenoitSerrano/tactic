import { useLocation } from 'react-router-dom';
import { computeEditingBreadcrumbs } from './computeEditingBreadcrumbs';
import { Typography, styled } from '@mui/material';
import { Link } from '../../Link';
import { BreadcrumbsSelect } from './BreadcrumbsSelect';

function EditingBreadcrumbs() {
    const location = useLocation();

    return (
        <Container>
            <BreadcrumbsSelect pathname={location.pathname} />
            <BreadcrumbsContainer>{renderBreadcrumbs()}</BreadcrumbsContainer>
        </Container>
    );

    function renderBreadcrumbs() {
        const editingBreadcrumbs = computeEditingBreadcrumbs(location.pathname);
        const renderedBreadcrumbs: React.ReactNode[] = [];

        if (editingBreadcrumbs.length === 0) {
            return renderedBreadcrumbs;
        }
        for (let i = 0; i < editingBreadcrumbs.length; i++) {
            const editingBreadcrumb = editingBreadcrumbs[i];
            const renderedBreadcrumb = (
                <BreadcrumbTypographyContainer key={`breadcrumb-editing-${i}`}>
                    {editingBreadcrumb.label}
                </BreadcrumbTypographyContainer>
            );
            if (editingBreadcrumb.isActive || !editingBreadcrumb.href) {
                renderedBreadcrumbs.push(renderedBreadcrumb);
            } else {
                renderedBreadcrumbs.push(
                    <Link to={editingBreadcrumb.href} key={`breadcrumb-editing-${i}`}>
                        {renderedBreadcrumb}
                    </Link>,
                );
            }

            if (i < editingBreadcrumbs.length - 1) {
                renderedBreadcrumbs.push(<Chevron key={`chevron-${i}`} />);
            }
        }
        return renderedBreadcrumbs;
    }
}

function Chevron() {
    return <div>{'>'}</div>;
}

const BreadcrumbTypographyContainer = styled(Typography)(({ theme }) => ({
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
}));
const BreadcrumbsContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));
const Container = styled('div')({ flex: 1 });

export { EditingBreadcrumbs };
