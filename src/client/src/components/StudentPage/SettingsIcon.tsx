import { useState } from 'react';
import { IconButton } from '../IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { Drawer } from '../Drawer';
import { useStudentConfig } from '../../lib/studentConfig';

function SettingsIconButton() {
    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const { studentConfig, setStudentOption } = useStudentConfig();
    const options = buildOptions();
    return (
        <>
            <IconButton
                IconComponent={SettingsIcon}
                title="Paramètres"
                onClick={openSettingsDrawer}
            />
            <Drawer
                title="Paramètres"
                isOpen={areSettingsOpen}
                onClose={closeSettingsDrawer}
                options={options}
            />
        </>
    );

    function buildOptions() {
        return [
            {
                label: 'Afficher le clavier virtuel pour les accents à côté de chaque champ',
                isChecked: studentConfig.shouldDisplayAccentKeyboard,
                setIsChecked: onChangeShouldDisplayAccentKeyboard,
            },
        ];
    }

    function onChangeShouldDisplayAccentKeyboard(isChecked: boolean) {
        setStudentOption('shouldDisplayAccentKeyboard', isChecked);
    }

    function openSettingsDrawer() {
        setAreSettingsOpen(true);
    }

    function closeSettingsDrawer() {
        setAreSettingsOpen(false);
    }
}

export { SettingsIconButton };
