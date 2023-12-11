const sanitizer = { sanitizeString };

function sanitizeString(value: string) {
    return value
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/’/g, "'")
        .replace(/ ?' ?/g, "'")
        .replace(/é/g, 'é')
        .replace(/ê/g, 'ê')
        .replace(/\.$/, '');
}

export { sanitizer };
