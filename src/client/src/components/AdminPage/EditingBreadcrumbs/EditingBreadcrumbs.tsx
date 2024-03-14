import { useLocation } from 'react-router-dom';
import { computeEditingBreadcrumbs } from './computeEditingBreadcrumbs';
import { Typography, styled } from '@mui/material';

function EditingBreadcrumbs() {
    const location = useLocation();

    return <BreadcrumbsContainer>{renderBreadcrumbs()}</BreadcrumbsContainer>;

    function renderBreadcrumbs() {
        const editingBreadcrumbs = computeEditingBreadcrumbs(location.pathname);
        const renderedBreadcrumbs: React.ReactNode[] = [];

        if (editingBreadcrumbs.length === 0) {
            return renderedBreadcrumbs;
        }
        for (let i = 0; i < editingBreadcrumbs.length; i++) {
            const editingBreadcrumb = editingBreadcrumbs[i];
            const renderedBreadcrumb = (
                <BreadcrumbContainer>
                    <Typography>{editingBreadcrumb.label}</Typography>
                </BreadcrumbContainer>
            );

            renderedBreadcrumbs.push(renderedBreadcrumb);

            if (i < editingBreadcrumbs.length - 1) {
                renderedBreadcrumbs.push(<Chevron />);
            }
        }
        return renderedBreadcrumbs;
    }
}

function Chevron() {
    return <div>{'>'}</div>;
}

const BreadcrumbContainer = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
}));
const BreadcrumbsContainer = styled('div')({ display: 'flex', alignItems: 'center' });

export { EditingBreadcrumbs };
