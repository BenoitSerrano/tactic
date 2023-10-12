const encoder = { stringToBase64, base64ToString };

function base64ToString(str: string): string {
    return Buffer.from(str, 'base64').toString();
}

function stringToBase64(str: string) {
    return Buffer.from(str).toString('base64');
}

export { encoder };
