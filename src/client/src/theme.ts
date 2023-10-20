import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            light: '#52b2ff',
            dark: '#3732cc',
            main: '#266cff',
        },
        background: { default: '#e2f2ff' },
        divider: '#baddff',
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
            fontWeight: 'normal',
        },
        h4: {
            fontSize: '1.2rem',
            fontWeight: 'normal',
        },
        h5: {
            fontSize: '1.1rem',
            fontWeight: 'normal',
        },
        h6: {
            fontSize: '1.0rem',
            fontWeight: 'normal',
        },
    },
});

export { theme };
