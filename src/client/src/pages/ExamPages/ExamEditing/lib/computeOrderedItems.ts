function computeOrderedItems<itemT extends { id: number }>(ids: number[], items: itemT[]): itemT[] {
    const mappedItems = items.reduce((acc, item) => {
        return { ...acc, [item.id]: item };
    }, {} as Record<number, itemT>);
    return ids.map((id) => mappedItems[id]).filter(Boolean);
}

export { computeOrderedItems };
