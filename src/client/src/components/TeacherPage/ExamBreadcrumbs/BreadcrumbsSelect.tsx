import { MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import { computeExamBreadcrumbs } from './computeExamBreadcrumbs';
import { useNavigate } from 'react-router-dom';

function BreadcrumbsSelect(props: { pathname: string }) {
    const navigate = useNavigate();
    const editingBreadcrumbs = computeExamBreadcrumbs(props.pathname);
    const currentEditingBreadcrumb = editingBreadcrumbs.find(
        (editingBreadcrumb) => editingBreadcrumb.isActive,
    );
    return (
        <Container>
            {currentEditingBreadcrumb && (
                <Select
                    fullWidth
                    labelId="select-href-to-navigate-to-label"
                    id="select-href-to-navigate-to"
                    value={currentEditingBreadcrumb.href}
                    label="Aller à :"
                    onChange={onSelectHref}
                >
                    {editingBreadcrumbs.map((editingBreadcrumb) => (
                        <MenuItem key={editingBreadcrumb.label} value={editingBreadcrumb.href}>
                            {editingBreadcrumb.label}
                        </MenuItem>
                    ))}
                </Select>
            )}
        </Container>
    );

    function onSelectHref(event: SelectChangeEvent) {
        const newHref = event.target.value;
        if (newHref !== currentEditingBreadcrumb?.href) {
            navigate(newHref);
        }
    }
}

const Container = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));

export { BreadcrumbsSelect };
