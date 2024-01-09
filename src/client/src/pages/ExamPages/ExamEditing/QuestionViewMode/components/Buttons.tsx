import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Button } from '../../../../../components/Button';

function RemoveButton(props: { onClick: () => void; disabled?: boolean }) {
    return (
        <Button
            onClick={props.onClick}
            variant="outlined"
            color="error"
            startIcon={<RemoveCircleOutlineIcon />}
            disabled={props.disabled}
        >
            Retirer
        </Button>
    );
}

export { RemoveButton };
