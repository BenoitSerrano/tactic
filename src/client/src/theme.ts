import { createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        h1: {
            fontSize: '3rem',
            fontWeight: 'normal',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 'normal',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 'normal',
        },
        h4: {
            fontSize: '1.2rem',
            fontWeight: 'normal',
        },
    },
});

export { theme };
