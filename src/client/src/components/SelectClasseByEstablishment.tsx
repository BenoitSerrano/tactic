import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader } from './Loader';

function SelectClasseByEstablishment(props: {
    establishmentId: string;
    selectedClasseId: string | undefined;
    setSelectedClasseId: (selectedClasseId: string) => void;
}) {
    const query = useQuery({
        queryFn: () => api.fetchEstablishmentWithClasses(props.establishmentId),
        queryKey: ['establishments', props.establishmentId, 'classes'],
    });
    if (!query.data) {
        return <Loader />;
    }
    return (
        <Select
            fullWidth
            labelId="select-classe-label"
            id="select-classe"
            value={props.selectedClasseId}
            label="Sélectionner une classe"
            onChange={onSelectClasseId}
        >
            {query.data.classes.map((classe: any) => (
                <MenuItem key={classe.id} value={classe.id}>
                    {classe.name}
                </MenuItem>
            ))}
        </Select>
    );

    function onSelectClasseId(event: SelectChangeEvent) {
        const newClasseId = event.target.value;
        props.setSelectedClasseId(newClasseId);
    }
}

export { SelectClasseByEstablishment };
