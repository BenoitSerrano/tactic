import { FormControlLabel, Drawer as MuiDrawer, styled, Switch, Typography } from '@mui/material';

type drawerOptionType = {
    label: string;
    isChecked: boolean;
    setIsChecked: (isChecked: boolean) => void;
};

function Drawer(props: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: drawerOptionType[];
}) {
    return (
        <MuiDrawer anchor="right" open={props.isOpen} onClose={props.onClose}>
            <Container>
                <TitleContainer>
                    <Typography variant="h3">{props.title}</Typography>
                </TitleContainer>
                {props.options.map((option) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={option.isChecked}
                                onChange={buildOnChangeSwitch(option.setIsChecked)}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </Container>
        </MuiDrawer>
    );

    function buildOnChangeSwitch(setIsChecked: (isChecked: boolean) => void) {
        return (_: React.ChangeEvent, checked: boolean) => {
            setIsChecked(checked);
        };
    }
}

export { Drawer };

const Container = styled('div')(({ theme }) => ({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    width: '25vw',
}));

const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));
