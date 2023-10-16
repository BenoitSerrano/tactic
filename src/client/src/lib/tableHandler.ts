const tableHandler = { swap };

function swap<T>(table: T[], index1: number, index2: number) {
    const newTable = [...table];
    const tmp = newTable[index1];
    newTable[index1] = newTable[index2];
    newTable[index2] = tmp;
    return newTable;
}

export { tableHandler };
