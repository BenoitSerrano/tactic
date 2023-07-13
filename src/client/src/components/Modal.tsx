import React from 'react';
import { Button, Modal as MuiModal, styled } from '@mui/material';

function Modal(props: {
    children: React.ReactElement | Array<React.ReactElement>;
    isOpen: boolean;
    close: () => void;
    onConfirm: () => void;
    confirmButtonLabel?: string;
}) {
    return (
        <MuiModal open={props.isOpen} onClose={props.close}>
            <ModalContent>
                <ModalBody>{props.children}</ModalBody>
                <ModalFooter>
                    <Button onClick={props.close}>Cancel</Button>
                    <Button variant="contained" onClick={onConfirm}>
                        {props.confirmButtonLabel || 'Confirm'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </MuiModal>
    );

    function onConfirm() {
        props.close();
        props.onConfirm();
    }
}

const ModalContent = styled('div')({
    borderRadius: '2px',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: 'white',
});

const ModalBody = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});
const ModalFooter = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
});

export { Modal };
