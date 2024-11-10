import { styled } from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { pathHandler } from '../../lib/pathHandler';
import { SideItemMenu } from './SideItemMenu';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Loader } from '../Loader';

function AdminSideMenu() {
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });
    if (!establishmentsQuery.data) {
        return <Loader />;
    }
    return (
        <Container>
            <SideItemMenu
                level="high"
                title="Tous mes examens"
                path={pathHandler.getRoutePath('EXAM_LIST_FOR_ALL')}
            />
            {establishmentsQuery.data.map((establishment) => (
                <SideItemContainer key={establishment.id}>
                    <SideItemMenu
                        level="medium"
                        title={establishment.name}
                        IconComponent={AccountBalanceOutlinedIcon}
                        path={pathHandler.getRoutePath('EXAM_LIST_FOR_ESTABLISHMENT', {
                            establishmentId: establishment.id,
                        })}
                    />
                    {establishment.classes.map((classe) => (
                        <SideItemContainer>
                            <SideItemMenu
                                level="low"
                                title={classe.name}
                                IconComponent={FolderOutlinedIcon}
                                path={pathHandler.getRoutePath('EXAM_LIST_FOR_CLASSE', {
                                    establishmentId: establishment.id,
                                    classeId: classe.id,
                                })}
                            />
                        </SideItemContainer>
                    ))}
                </SideItemContainer>
            ))}
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '25%',
    paddingLeft: theme.spacing(2),
    flexDirection: 'column',
}));
const SideItemContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
}));

export { AdminSideMenu };
