import { NON_WORD_CHARACTERS } from '../modules/question/constants';

const sanitizer = {
    sanitizeString,
};

function sanitizeString(value: string) {
    let sanitizedValue = value;
    for (const char of NON_WORD_CHARACTERS) {
        sanitizedValue = sanitizedValue.replace(new RegExp(`\\${char}`, 'g'), ` ${char} `);
    }

    sanitizedValue = sanitizedValue
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .replace(/’/g, " ' ")
        .replace(/“ ?/g, ` " `)
        .replace(/ ?”/g, ` " `)
        .replace(/« ?/g, ` " `)
        .replace(/ ?»/g, ` " `)
        .replace(/ ?' ?/g, " ' ")
        .replace(/é/g, 'é')
        .replace(/ê/g, 'ê')
        .replace(/\.+$/, '')
        .split(' ')
        .filter(Boolean)
        .join(' ');
    return sanitizedValue;
}

export { sanitizer };
