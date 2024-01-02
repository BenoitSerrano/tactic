import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { viewModeType } from './constants';

function ViewModeToggle(props: {
    currentViewMode: viewModeType;
    setCurrentViewMode: (viewMode: viewModeType) => void;
}) {
    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch
                        checked={props.currentViewMode === 'editing'}
                        onChange={handleOnChange}
                    />
                }
                label="Mode édition"
            />
        </FormGroup>
    );

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            props.setCurrentViewMode('editing');
        } else {
            props.setCurrentViewMode('previewing');
        }
    }
}

export { ViewModeToggle };
