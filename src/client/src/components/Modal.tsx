import { Modal as MuiModal, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Button } from './Button';

type modalSizeType = 'small' | 'large';

type buttonType = { label: string; IconComponent: React.ElementType; onClick: () => void };

function Modal(props: {
    isConfirmDisabled?: boolean;
    children: React.ReactElement | Array<React.ReactElement | boolean>;
    isOpen: boolean;
    close: () => void;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmButtonLabel?: string;
    cancelButtonLabel?: string;
    buttons?: buttonType[];
    isConfirmLoading?: boolean;
    title?: string;
    subtitle?: string;
    size?: 'small' | 'large';
}) {
    const ModalComponent = modalComponentMapping[props.size || 'large'];
    return (
        <StyledModal open={props.isOpen} onClose={props.close}>
            <ModalComponent>
                {!!props.title && (
                    <ModalHeader>
                        <Title variant="h2">{props.title}</Title>
                        {!!props.subtitle && <Typography variant="h3">{props.subtitle}</Typography>}
                    </ModalHeader>
                )}
                <ModalBody>{props.children}</ModalBody>

                <ModalFooter>
                    <ButtonContainer>
                        <Button color="inherit" onClick={onCancel}>
                            {props.cancelButtonLabel || 'Annuler'}
                        </Button>
                    </ButtonContainer>
                    {props.buttons?.map(({ IconComponent, label, onClick }) => (
                        <ButtonContainer>
                            <Button
                                variant="outlined"
                                onClick={onClick}
                                startIcon={<IconComponent />}
                            >
                                {label}
                            </Button>
                        </ButtonContainer>
                    ))}
                    <ButtonContainer>
                        <LoadingButton
                            disabled={props.isConfirmDisabled}
                            loading={props.isConfirmLoading}
                            variant="contained"
                            onClick={props.onConfirm}
                        >
                            {props.confirmButtonLabel || 'Confirmer'}
                        </LoadingButton>
                    </ButtonContainer>
                </ModalFooter>
            </ModalComponent>
        </StyledModal>
    );

    function onCancel() {
        if (props.onCancel) {
            props.onCancel();
        } else {
            props.close();
        }
    }
}

const ModalHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: 'white',
    top: 0,
    zIndex: 10,
}));

const ModalFooter = styled('div')(({ theme }) => ({
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

const modalDefaultProperties = {
    borderRadius: '2px',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    paddingLeft: '16px',
    paddingRight: '16px',
    overflow: 'auto',

    backgroundColor: 'white',
};
const ButtonContainer = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
}));

const SmallModalContent = styled('div')({
    ...modalDefaultProperties,
    minWidth: '45%',
    minHeight: '45%',
    maxHeight: '45%',
    maxWidth: '45%',
});

const LargeModalContent = styled('div')({
    ...modalDefaultProperties,
    minWidth: '80%',
    minHeight: '80%',
    maxHeight: '80%',
    maxWidth: '80%',
});

const modalComponentMapping: Record<modalSizeType, any> = {
    small: SmallModalContent,
    large: LargeModalContent,
};

const ModalBody = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));
const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(1) }));

const StyledModal = styled(MuiModal)({ zIndex: 999 });

export { Modal };
