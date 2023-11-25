import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Dialog(props: {
    title: string;
    text: string;
    isOpen: boolean;
    onClose: () => void;
    buttons: Array<JSX.Element>;
}) {
    return (
        <MuiDialog open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>{props.buttons}</DialogActions>
        </MuiDialog>
    );
}

export { Dialog };
