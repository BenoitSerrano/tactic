import { styled, Tooltip, Typography, IconButton as MuiIconButton } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { Modal } from '../Modal';
import { establishmentWithClassesType } from '../../lib/api/establishmentsApi';
import {
    DragDropContext,
    Draggable,
    DragStart,
    Droppable,
    DropResult,
    OnDragEndResponder,
    OnDragStartResponder,
} from 'react-beautiful-dnd';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../../lib/api/classesApi';
import { useAlert } from '../../lib/alert';

function EstablishmentListEditionModal(props: {
    isOpen: boolean;
    close: () => void;
    establishments: Array<establishmentWithClassesType>;
}) {
    const mappedEstablishements = props.establishments.reduce((acc, establishment) => {
        return { ...acc, [establishment.id]: establishment };
    }, {} as Record<string, establishmentWithClassesType>);
    const [currentEstablishments, setCurrentEstablishments] = useState(mappedEstablishements);
    const [droppableIdCurrentlyDragging, setDroppableIdCurrentlyDragging] = useState<
        string | undefined
    >(undefined);
    const { displayAlert } = useAlert();

    const queryClient = useQueryClient();
    const bulkUpdateClasseEstablishmentIdMutation = useMutation({
        mutationFn: classesApi.bulkUpdateClasseEstablishmentId,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['establishments', 'with-classes'] });
            displayAlert({
                text: `La liste des établissements a bien été modifiée.`,
                variant: 'success',
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. La liste des établissements n'a pas pu être modifiée.",
            });
        },
    });
    return (
        <Modal
            size="large"
            title="Éditer la liste des établissements"
            close={props.close}
            isOpen={props.isOpen}
            onConfirm={onConfirm}
            confirmButtonLabel="Enregistrer les modifications"
        >
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <ModalContent>
                    {props.establishments.map(({ id }) => {
                        const establishment = currentEstablishments[id];
                        return (
                            <Droppable
                                isDropDisabled={
                                    droppableIdCurrentlyDragging === `droppable:${establishment.id}`
                                }
                                droppableId={`droppable:${establishment.id}`}
                                key={establishment.id}
                            >
                                {(droppableClasseProvided) => (
                                    <SideItemListContainer
                                        ref={droppableClasseProvided.innerRef}
                                        {...droppableClasseProvided.droppableProps}
                                    >
                                        <SideItemContainer>
                                            <SideItemMainContentContainer>
                                                <SideItemIconContainer>
                                                    <AccountBalanceOutlinedIcon
                                                        fontSize={'medium'}
                                                    />
                                                </SideItemIconContainer>
                                                <Typography variant="h5">
                                                    {establishment.name}
                                                </Typography>
                                            </SideItemMainContentContainer>
                                        </SideItemContainer>

                                        {establishment.classes.map((classe, classeIndex) => (
                                            <Draggable
                                                key={'classe:' + classe.id}
                                                draggableId={'classe:' + classe.id}
                                                index={classeIndex}
                                            >
                                                {(draggableClasseProvided) => (
                                                    <SideItemListContainer
                                                        ref={draggableClasseProvided.innerRef}
                                                        {...draggableClasseProvided.draggableProps}
                                                    >
                                                        <SideItemContainer>
                                                            <SideItemMainContentContainer>
                                                                <SideItemIconContainer>
                                                                    <GroupsIcon fontSize="small" />
                                                                </SideItemIconContainer>
                                                                <Typography variant="h6">
                                                                    {classe.name}
                                                                </Typography>
                                                            </SideItemMainContentContainer>
                                                            <Tooltip title="Maintenez le clic enfoncé pour déplacer la classe dans un autre établissement">
                                                                <MuiIconButton
                                                                    {...draggableClasseProvided.dragHandleProps}
                                                                >
                                                                    <DragIndicatorIcon />
                                                                </MuiIconButton>
                                                            </Tooltip>
                                                        </SideItemContainer>
                                                    </SideItemListContainer>
                                                )}
                                            </Draggable>
                                        ))}
                                        {droppableClasseProvided.placeholder}
                                    </SideItemListContainer>
                                )}
                            </Droppable>
                        );
                    })}
                </ModalContent>
            </DragDropContext>
        </Modal>
    );

    function onConfirm() {
        bulkUpdateClasseEstablishmentIdMutation.mutate({
            establishments: Object.values(currentEstablishments).map((establishment) => ({
                id: establishment.id,
                classeIds: establishment.classes.map((classe) => classe.id),
            })),
        });
    }
    function onDragStart(start: DragStart): ReturnType<OnDragStartResponder> {
        setDroppableIdCurrentlyDragging(start.source.droppableId);
    }

    function onDragEnd(result: DropResult): ReturnType<OnDragEndResponder> {
        if (!result.destination) {
            return;
        }
        if (result.destination.droppableId === result.source.droppableId) {
            return;
        }

        const sourceEstablishmentId = result.source.droppableId.split(':')[1];
        const destinationEstablishmentId = result.destination.droppableId.split(':')[1];
        const sourceClasseId = result.draggableId.split(':')[1];
        const sourceClasse = currentEstablishments[sourceEstablishmentId].classes.find(
            (classe) => classe.id === sourceClasseId,
        );
        if (!sourceClasse) {
            return;
        }
        const newSourceEstablishment = {
            ...currentEstablishments[sourceEstablishmentId],
            classes: currentEstablishments[sourceEstablishmentId].classes.filter(
                (classe) => classe.id !== sourceClasseId,
            ),
        };
        const newDestinationEstablishment = {
            ...currentEstablishments[destinationEstablishmentId],
            classes: [...currentEstablishments[destinationEstablishmentId].classes, sourceClasse],
        };
        setCurrentEstablishments({
            ...currentEstablishments,
            [sourceEstablishmentId]: newSourceEstablishment,
            [destinationEstablishmentId]: newDestinationEstablishment,
        });
    }
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
