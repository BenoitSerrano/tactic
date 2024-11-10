import { styled } from '@mui/material';
import { ClasseSideItemMenu, EstablishmentSideItemMenu, OverallSideItemMenu } from './SideItemMenu';
import { establishmentWithClassesType } from '../../lib/api/api';

function AdminSideMenu(props: { establishments: Array<establishmentWithClassesType> }) {
    return (
        <Container>
            <OverallSideItemMenu />
            {props.establishments.map((establishment) => (
                <SideItemContainer key={establishment.id}>
                    <EstablishmentSideItemMenu establishment={establishment} />
                    {establishment.classes.map((classe) => (
                        <SideItemContainer>
                            <ClasseSideItemMenu
                                establishmentId={establishment.id}
                                classe={classe}
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
