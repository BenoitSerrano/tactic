import { config } from '../config';
import { Buffer } from 'buffer';

const authentication = {
    isPasswordValid,
    getEncodedPassword,
};

function isPasswordValid(password: string) {
    return password === config.PASSWORD;
}

function getEncodedPassword() {
    const buff = Buffer.from(config.PASSWORD, 'utf-8');
    return buff.toString('base64');
}

export { authentication };
