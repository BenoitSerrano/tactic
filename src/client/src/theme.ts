import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            light: '#67ded1',
            dark: '#00937d',
            main: '#00c0ac',
        },
        secondary: {
            main: '#f35d6a',
        },
        warning: { main: '#e87a00', light: '#f5b44d' },
        common: { black: '#003228' },
        background: { default: '#eaf8f7' },
        divider: '#a1ece4',
    },
    spacing: (value: number) => value * 8,
    typography: {
        fontFamily: ['inter'].join(','),
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
            fontSize: '0.8rem',
            fontWeight: 'normal',
        },
    },
});

export { theme };
