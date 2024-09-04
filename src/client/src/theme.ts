import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            light: '#CADDDB',
            dark: '#00606E',
            main: '#3C8E8C',
        },
        secondary: {
            main: '#1647d8',
        },
        warning: { main: '#e87a00', light: '#f5b44d' },
        common: { black: '#034D59' },
        background: { default: '#CADDDB' },
        divider: '##D0E0E3',
    },
    spacing: (value: number) => value * 8,
    components: {
        MuiDialogTitle: { styleOverrides: { root: { fontSize: '1.5rem', fontWeight: 'bold' } } },
    },
    typography: {
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
