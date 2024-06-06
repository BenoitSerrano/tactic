const sanitizer = {
    sanitize,
};

function sanitize(value: string) {
    let sanitized = value;
    sanitized = sanitized.replace(/\n/g, ' ');
    sanitized = sanitized.replace(/  +/g, ' ');
    return sanitized;
}

export { sanitizer };
