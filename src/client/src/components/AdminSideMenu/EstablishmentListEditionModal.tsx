import { styled, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { Modal } from '../Modal';
import { establishmentWithClassesType } from '../../lib/api/establishmentsApi';
import { IconButton } from '../IconButton';

function EstablishmentListEditionModal(props: {
    isOpen: boolean;
    close: () => void;
    establishments: Array<establishmentWithClassesType>;
}) {
    return (
        <Modal
            size="large"
            title="Éditer la liste des établissements"
            close={props.close}
            isOpen={props.isOpen}
            onConfirm={onConfirm}
        >
            <ModalContent>
                {props.establishments.map((establishment) => (
                    <SideItemListContainer key={establishment.id}>
                        <SideItemContainer>
                            <SideItemMainContentContainer>
                                <SideItemIconContainer>
                                    <AccountBalanceOutlinedIcon fontSize={'medium'} />
                                </SideItemIconContainer>
                                <Typography variant="h5">{establishment.name}</Typography>
                            </SideItemMainContentContainer>
                        </SideItemContainer>

                        {establishment.classes.map((classe) => (
                            <SideItemListContainer key={classe.id}>
                                <SideItemContainer>
                                    <SideItemMainContentContainer>
                                        <SideItemIconContainer>
                                            <GroupsIcon fontSize="small" />
                                        </SideItemIconContainer>
                                        <Typography variant="h6">{classe.name}</Typography>
                                    </SideItemMainContentContainer>
                                    <IconButton
                                        IconComponent={DragIndicatorIcon}
                                        title="Déplacer la classe dans un autre établissement"
                                    />
                                </SideItemContainer>
                            </SideItemListContainer>
                        ))}
                    </SideItemListContainer>
                ))}
            </ModalContent>
        </Modal>
    );

    function onConfirm() {}
}

const SideItemListContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
}));
const SideItemContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
}));
const SideItemMainContentContainer = styled('div')(({ theme }) => ({ flex: 1, display: 'flex' }));
const SideItemIconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}));

const ModalContent = styled('div')(({ theme }) => ({ display: 'flex' }));
export { EstablishmentListEditionModal };
