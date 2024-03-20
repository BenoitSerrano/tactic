import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';
import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';

type alertHandlerType = { displayAlert: ({ text, variant }: alertType) => void };

type alertType = {
    variant: 'error' | 'success' | 'warning';
    text: string;
    autoHideDuration?: number | null;
};

const AlertHandlerContext = createContext<alertHandlerType>({
    displayAlert: () => null,
});

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

const DEFAULT_AUTO_HIDE_DURATION = 2500;

function AlertHandlerContextProvider(props: { children: ReactNode }): ReactElement {
    const [alert, setAlert] = useState<alertType | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const alertHandler = {
        displayAlert,
    };

    const autoHideDuration =
        alert?.autoHideDuration === undefined ? DEFAULT_AUTO_HIDE_DURATION : alert.autoHideDuration;

    return (
        <AlertHandlerContext.Provider value={alertHandler}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                open={isOpen}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alert?.variant}>
                    {alert?.text}
                </Alert>
            </Snackbar>
            {props.children}
        </AlertHandlerContext.Provider>
    );

    function displayAlert(alert: alertType) {
        setIsOpen(true);
        setAlert(alert);
    }

    function handleClose() {
        setIsOpen(false);
    }
}

function useAlert() {
    return useContext(AlertHandlerContext);
}

export { AlertHandlerContextProvider, useAlert };
