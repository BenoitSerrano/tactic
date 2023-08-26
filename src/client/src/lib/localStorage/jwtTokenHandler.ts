const KEY = 'TDL_JWT_TOKEN';

function get() {
    return localStorage.getItem(KEY) || undefined;
}

function set(value: string) {
    localStorage.setItem(KEY, value);
}

function remove() {
    localStorage.removeItem(KEY);
}

const jwtTokenHandler = { get, set, remove };

export { jwtTokenHandler };
