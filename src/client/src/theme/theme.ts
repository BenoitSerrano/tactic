import { createTheme } from '@mui/material';
import { palette } from './palette';

const theme = createTheme({
    palette,
    spacing: (value: number) => value * 8,
    components: {
        MuiDialogTitle: { styleOverrides: { root: { fontSize: '1.5rem', fontWeight: 'bold' } } },
    },
    typography: {
        button: {
            textTransform: 'none',
        },
        fontFamily: ['quicksand', 'Trebuchet MS'].join(','),

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
            fontWeight: 'bold',
        },
        h4: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
        },
        h5: {
            fontSize: '1.1rem',
            fontWeight: 'normal',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 'normal',
        },
        caption: {
            fontSize: '2rem',
        },
    },
});

export { theme };
