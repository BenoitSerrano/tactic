function computeOrderForIndex<entityT extends { order: number }>(
    index: number,
    entities: entityT[],
) {
    if (entities.length === 0) {
        return 0;
    }
    if (index === -1) {
        return entities[0].order - 1;
    }
    if (index === entities.length - 1) {
        return entities[index].order + 1;
    }
    return (entities[index].order + entities[index + 1].order) / 2;
}

export { computeOrderForIndex };
