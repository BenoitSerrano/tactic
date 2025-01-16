import { ListSubheader, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '../../../../components/LoadingButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    establishmentsApi,
    establishmentWithClassesType,
} from '../../../../lib/api/establishmentsApi';
import { ReactNode, useState } from 'react';
import { Loader } from '../../../../components/Loader';
import { examsApi } from '../../../../lib/api/examsApi';
import { useAlert } from '../../../../lib/alert';
import { parseClasse, stringifyClasse } from './utils';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../../../lib/pathHandler';

function EditableClasse(props: {
    currentClasseId: string;
    currentEtablishmentId: string;
    examName: string;
    examId: string;
}) {
    const establishmentsQueryKey = ['establishments', 'with-classes'];
    const examQueryKey = ['exams', 'with-classes'];
    const establishmentsQuery = useQuery({
        queryKey: establishmentsQueryKey,
        queryFn: establishmentsApi.getEstablishmentsWithClasses,
    });
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const updateExamClasseMutation = useMutation({
        mutationFn: examsApi.updateClasseId,
        onSuccess: () => {
            const newClasse = parseClasse(selectedClasse);
            if (newClasse) {
                navigate(
                    pathHandler.getRoutePath('EXAM_PARAMETERS', {
                        examId: props.examId,
                        establishmentId: newClasse.establishmentId,
                        classeId: newClasse.classeId,
                    }),
                );
            }
            displayAlert({
                variant: 'success',
                text: `La classe de l'examen "${props.examName}" a bien été modifiée.`,
            });

            queryClient.invalidateQueries({ queryKey: establishmentsQueryKey });
            queryClient.invalidateQueries({ queryKey: examQueryKey });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Les modifications n'ont pas pu être enregistrées.",
            });
        },
    });
    const currentClasse = stringifyClasse(props.currentEtablishmentId, props.currentClasseId);
    const [selectedClasse, setSelectedClasse] = useState<string>(currentClasse);
    if (!establishmentsQuery.data) {
        if (establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }
    return (
        <Container>
            <SelectContainer>
                <Select
                    fullWidth
                    onChange={onSelectClasseId}
                    labelId="select-classe-label"
                    id="select-classe"
                    value={selectedClasse}
                >
                    {renderMenuItems(establishmentsQuery.data)}
                </Select>
            </SelectContainer>

            <LoadingButton onClick={updateExamClasse} variant="outlined" startIcon={<SaveIcon />}>
                Sauvegarder
            </LoadingButton>
        </Container>
    );

    function updateExamClasse() {
        const newParsedClasse = parseClasse(selectedClasse);
        if (!newParsedClasse) {
            return;
        }
        updateExamClasseMutation.mutate({
            examId: props.examId,
            previousClasseId: props.currentClasseId,
            newClasseId: newParsedClasse.classeId,
        });
    }

    function onSelectClasseId(event: SelectChangeEvent) {
        setSelectedClasse(event.target.value);
    }

    function renderMenuItems(establishments: establishmentWithClassesType[]) {
        const menuItems: ReactNode[] = [];
        for (const establishment of establishments) {
            if (establishment.classes.length === 0) {
                continue;
            }
            menuItems.push(
                <ListSubheader key={`header:establishment:${establishment.id}`}>
                    {establishment.name}
                </ListSubheader>,
            );
            for (const classe of establishment.classes) {
                const stringifyiedClasse = stringifyClasse(establishment.id, classe.id);
                menuItems.push(
                    <MenuItem
                        disabled={stringifyiedClasse === selectedClasse}
                        key={`item:classe:${classe.id}`}
                        value={stringifyiedClasse}
                    >
                        {classe.name}
                    </MenuItem>,
                );
            }
        }
        return menuItems;
    }
}

const Container = styled('div')(({ theme }) => ({ flex: 1 }));
const SelectContainer = styled('div')(({ theme }) => ({}));
export { EditableClasse };
