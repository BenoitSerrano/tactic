const textSplitter = { split };

function split(text: string): string[] {
    return text ? text.split(' ') : [];
}
export { textSplitter };
