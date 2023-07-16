import React, { createContext, ReactElement, ReactNode, useContext, useState } from 'react';
import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';

type alertHandlerType = { displayAlert: ({ text, variant }: alertType) => void };

type alertType = {
    variant: 'error' | 'success';
    text: string;
};

const AlertHandlerContext = createContext<alertHandlerType>({
    displayAlert: () => null,
});

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

function AlertHandlerContextProvider(props: { children: ReactNode }): ReactElement {
    const [alert, setAlert] = useState<alertType | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const alertHandler = {
        displayAlert,
    };

    return (
        <AlertHandlerContext.Provider value={alertHandler}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                open={isOpen}
                autoHideDuration={2000}
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
