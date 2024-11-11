import { config } from '../config';

const developmentPalette = {
    primary: {
        light: '#BCED09',
        dark: '#7D9D06',
        main: '#9CC507',
    },
    secondary: {
        main: '#1647d8',
    },
    warning: { main: '#e87a00', light: '#f5b44d' },
    common: { black: '#1F2701' },
    background: { default: '#FAFEEB' },
    divider: '#F5FED8',
};

const defaultPalette = {
    primary: {
        light: '#A4CFCF',
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

const palette = config.NODE_ENV !== 'development' ? developmentPalette : defaultPalette;

export { palette };
