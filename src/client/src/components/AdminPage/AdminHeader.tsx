import { useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { EditingBreadcrumbs } from './EditingBreadcrumbs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from '../Link';
import { pathHandler } from '../../lib/pathHandler';
import { Logo } from '../Logo';
import { LogoutButton } from './LogoutButton';
import { EDITING_EXAM_ROUTE_KEYS } from '../../routes/routeKeys';
import { styled } from '@mui/material';
import { IconLink } from '../IconLink';

function AdminHeader() {
    const location = useLocation();

    const buttons = computeRightButtons(location.pathname);

    return (
        <Header
            buttons={buttons}
            MiddleContent={<EditingBreadcrumbs />}
            LeftContent={
                <Link to={pathHandler.getRoutePath('TEACHER_HOME')}>
                    <Logo variant="full" />
                </Link>
            }
        />
    );

    function computeRightButtons(currentPath: string) {
        const logoutButton = <LogoutButton key="logout-button" />;
        const parsedPath = pathHandler.parsePath(currentPath);
        if (!parsedPath) {
            return [logoutButton];
        }
        if (!EDITING_EXAM_ROUTE_KEYS.includes(parsedPath.routeKey as any)) {
            return [logoutButton];
        }
        const { parameters } = parsedPath;
        const examPreviewingLink = pathHandler.getRoutePath('EXAM_PREVIEWING', {
            examId: parameters.examId,
        });

        return [
            <PreviewLinkContainer>
                <IconLink
                    title="Aperçu de l'examen"
                    to={examPreviewingLink}
                    IconComponent={VisibilityIcon}
                />
            </PreviewLinkContainer>,
            logoutButton,
        ];
    }
}

const PreviewLinkContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(2) }));

export { AdminHeader };
