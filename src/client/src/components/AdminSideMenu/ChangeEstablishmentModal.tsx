import { Button } from '../Button';
import { Loader } from '../Loader';
import { ChangeEstablishmentItem } from './ChangeEstablishmentItem';
import { Modal, styled } from '@mui/material';

function ChangeEstablishmentModal(props: {
    coordinates?: { x: number; y: number };
    currentEstablishmentId: string;
    establishments: Array<{ id: string; name: string }> | undefined;
    close: () => void;
    openCreateEstablishmentModal: () => void;
}) {
    return (
        <Modal onClose={props.close} open={!!props.coordinates}>
            {props.establishments && !!props.coordinates ? (
                <ModalContent x={props.coordinates.x} y={props.coordinates.y}>
                    <EstablishmentList>
                        {props.establishments.map((establishment) => (
                            <ChangeEstablishmentItem
                                closeModal={props.close}
                                isSelected={establishment.id === props.currentEstablishmentId}
                                key={establishment.id}
                                id={establishment.id}
                                name={establishment.name}
                            />
                        ))}
                    </EstablishmentList>
                    <CreateEstablishmentButtonContainer>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={onClickOnCreateEstablishment}
                        >
                            Ajouter un nouvel établissement
                        </Button>
                    </CreateEstablishmentButtonContainer>
                </ModalContent>
            ) : (
                <Loader />
            )}
        </Modal>
    );

    function onClickOnCreateEstablishment() {
        props.openCreateEstablishmentModal();
        props.close();
    }
}

export { ChangeEstablishmentModal };

const ModalContent = styled('div')<{ x: number; y: number }>(({ theme, x, y }) => ({
    marginTop: `calc(${theme.spacing(3)} + ${y}px)`,
    marginLeft: `calc(${theme.spacing(2)} + ${x}px)`,
    width: '25%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: theme.shadows[1],
}));

const EstablishmentList = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(1),
    borderBottom: `solid 2px ${theme.palette.divider}`,
}));

const CreateEstablishmentButtonContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));
