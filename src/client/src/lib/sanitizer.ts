import { NON_WORD_CHARACTERS } from '../constants';

const sanitizer = { sanitizeString };

function sanitizeString(value: string) {
    let sanitizedValue = value;
    for (const char of NON_WORD_CHARACTERS) {
        sanitizedValue = sanitizedValue.replace(new RegExp(`\\${char}`, 'g'), ` ${char} `);
    }

    sanitizedValue = sanitizedValue
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/’/g, "'")
        .replace(/“ ?/g, `"`)
        .replace(/ ?”/g, `"`)
        .replace(/« ?/g, `"`)
        .replace(/ ?»/g, `"`)
        .replace(/ ?' ?/g, "'")
        .replace(/é/g, 'é')
        .replace(/ê/g, 'ê')
        .replace(/ ?\.+$/, '');
    return sanitizedValue;
}

export { sanitizer };
