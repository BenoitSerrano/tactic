import { useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { ExamBreadcrumbs } from './ExamBreadcrumbs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from '../Link';
import { pathHandler } from '../../lib/pathHandler';
import { Logo } from '../Logo';
import { LogoutButton } from './LogoutButton';
import { EXAM_ROUTE_KEYS } from '../../routes/routeKeys';
import { styled } from '@mui/material';
import { IconLink } from '../IconLink';
import { localStorage } from '../../lib/localStorage';
import { ReactNode, useEffect, useState } from 'react';
import { RemainingPaperIcon } from './RemainingPaperIcon';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../lib/api/usersApi';

function TeacherHeader() {
    const [remainingPapers, setRemainingPapers] = useState<number | undefined>(
        localStorage.userInfoHandler.get()?.remainingPapers,
    );
    const remainingPapersQuery = useQuery({
        queryKey: ['remaining-papers'],
        queryFn: usersApi.getUserRemainingPapers,
    });
    useEffect(() => {
        const newRemainingPapers = remainingPapersQuery.data?.remainingPapers;
        if (newRemainingPapers !== undefined) {
            setRemainingPapers(newRemainingPapers);
            localStorage.userInfoHandler.setRemainingPapers(newRemainingPapers);
        }
    }, [remainingPapersQuery.data?.remainingPapers]);

    const location = useLocation();

    const buttons = computeRightButtons(location.pathname);

    return (
        <Header
            buttons={buttons}
            MiddleContent={<ExamBreadcrumbs />}
            LeftContent={
                <Link to={pathHandler.getRoutePath('TEACHER_HOME')}>
                    <Logo variant="full" />
                </Link>
            }
        />
    );

    function computeRightButtons(currentPath: string) {
        const rightButtons: ReactNode[] = [];
        const logoutButton = <LogoutButton key="logout-button" />;
        rightButtons.push(logoutButton);

        const parsedPath = pathHandler.parsePath(currentPath);
        if (!parsedPath) {
            return rightButtons;
        }
        if (remainingPapers) {
            rightButtons.unshift(<RemainingPaperIcon remainingPapers={remainingPapers} />);
        }
        if (!EXAM_ROUTE_KEYS.includes(parsedPath.routeKey as any)) {
            return rightButtons;
        }

        const { parameters } = parsedPath;
        const examPreviewingLink = pathHandler.getRoutePath('EXAM_PREVIEWING', parameters);
        const examPreviewingComponent = (
            <PreviewLinkContainer key="preview-link-button">
                <IconLink
                    title="Aperçu de l'examen"
                    to={examPreviewingLink}
                    IconComponent={VisibilityIcon}
                />
            </PreviewLinkContainer>
        );
        rightButtons.unshift(examPreviewingComponent);
        return rightButtons;
    }
}

const PreviewLinkContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(2) }));

export { TeacherHeader };
