const focusHandler = {
    buildHandleFocusEvent,
};

function buildHandleFocusEvent(callback: Function) {
    return (event: FocusEvent) => {
        callback((event.currentTarget as Window).location.pathname);
    };
}

export { focusHandler };
