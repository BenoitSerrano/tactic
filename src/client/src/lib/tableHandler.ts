const tableHandler = { shift };

function shift<T>(table: T[], indexSource: number, indexDest: number) {
    const newTable = [...table];
    const elementSource = newTable[indexSource];

    newTable.splice(indexSource, 1);
    newTable.splice(indexDest, 0, elementSource);

    return newTable;
}

export { tableHandler };
