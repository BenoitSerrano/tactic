import { config } from '../config';

const developmentPalette = {
    primary: {
        light: '#A288A6',
        dark: '#654F69',
        main: '#89678C',
    },
    secondary: {
        main: '#1647d8',
    },
    warning: { main: '#e87a00', light: '#f5b44d' },
    common: { black: '#221A23' },
    background: { default: '#DAD0DC' },
    divider: '#C8B9CA',
};

const defaultPalette = {
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
    divider: '#D0E0E3',
};

const palette = config.NODE_ENV === 'development' ? developmentPalette : defaultPalette;

export { palette };
