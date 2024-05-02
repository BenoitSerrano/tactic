import { Drawer, FormControlLabel, Switch, Typography } from '@mui/material';
import { denominatorType } from './lib/denominatorHandler';

function SettingsDrawer(props: {
    isOpen: boolean;
    close: () => void;
    onChangeTotalDenominator: (denominator: denominatorType) => void;
    totalDenominator: denominatorType;
}) {
    return (
        <Drawer open={props.isOpen} onClose={props.close}>
            <Typography variant="h3">Paramètres d'affichage</Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={props.totalDenominator === '20'}
                        onChange={onToggleTotalDenominator}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
                label="Afficher la note totale sur 20 dans le tableau"
            />
        </Drawer>
    );

    function onToggleTotalDenominator(_: React.ChangeEvent, checked: boolean) {
        props.onChangeTotalDenominator(checked ? '20' : 'original');
    }
}

export { SettingsDrawer };
