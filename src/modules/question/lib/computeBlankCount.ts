function computeBlankCount(title: string) {
    const blankCount = title.split(' ').filter((chunk) => chunk === '....').length;
    if (!blankCount) {
        throw new Error(`No blank for title ${title}`);
    }
    return blankCount;
}

export { computeBlankCount };
