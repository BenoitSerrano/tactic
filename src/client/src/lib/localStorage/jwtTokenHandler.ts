const KEY = 'TDL_JWT_TOKEN';

function get() {
    return localStorage.getItem(KEY) || undefined;
}

function set(value: string) {
    localStorage.setItem(KEY, value);
}

const jwtTokenHandler = { get, set };

export { jwtTokenHandler };
