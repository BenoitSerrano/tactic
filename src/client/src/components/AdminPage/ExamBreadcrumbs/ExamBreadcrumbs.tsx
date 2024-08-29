import { useLocation } from 'react-router-dom';
import { computeExamBreadcrumbs } from './computeExamBreadcrumbs';
import { Typography, styled } from '@mui/material';
import { BreadcrumbsSelect } from './BreadcrumbsSelect';
import { TextLink } from '../../TextLink';

function ExamBreadcrumbs() {
    const location = useLocation();

    return (
        <Container>
            <BreadcrumbsSelect pathname={location.pathname} />
            <BreadcrumbsContainer>{renderBreadcrumbs()}</BreadcrumbsContainer>
        </Container>
    );

    function renderBreadcrumbs() {
        const editingBreadcrumbs = computeExamBreadcrumbs(location.pathname);
        const renderedBreadcrumbs: React.ReactNode[] = [];

        if (editingBreadcrumbs.length === 0) {
            return renderedBreadcrumbs;
        }
        for (let i = 0; i < editingBreadcrumbs.length; i++) {
            const editingBreadcrumb = editingBreadcrumbs[i];
            if (editingBreadcrumb.isActive || !editingBreadcrumb.href) {
                renderedBreadcrumbs.push(
                    <ActiveBreadcrumb key={`breadcrumb-editing-${i}`}>
                        {editingBreadcrumb.label}
                    </ActiveBreadcrumb>,
                );
            } else {
                renderedBreadcrumbs.push(
                    <TextLink
                        label={editingBreadcrumb.label}
                        to={editingBreadcrumb.href}
                        key={`breadcrumb-editing-${i}`}
                    />,
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

const ActiveBreadcrumb = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    color: theme.palette.primary.dark,
    textShadow: `0px 0px 1px ${theme.palette.primary.dark}`,
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

export { ExamBreadcrumbs };
