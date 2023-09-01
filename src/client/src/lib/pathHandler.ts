const pathHandler = {
    extractCurrentAttemptId,
};

function extractCurrentAttemptId(pathname: string) {
    const PATH_REGEX =
        /^\/student\/students\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/attempts\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/;
    const result = pathname.match(PATH_REGEX);
    if (!result) {
        return undefined;
    }
    return result[2];
}

export { pathHandler };
