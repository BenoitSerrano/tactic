const eventHandler = {
    buildHandleWindowEvent,
};

function buildHandleWindowEvent<eventT extends Event>(callback: (path: string) => any) {
    return (event: eventT) => callback((event.currentTarget as Window).location.pathname);
}

export { eventHandler };
