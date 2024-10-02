const OPTIONS = ['shouldDisplayAccentKeyboard'] as const;
type studentOptionType = (typeof OPTIONS)[number];
const KEYS: Record<studentOptionType, string> = {
    shouldDisplayAccentKeyboard: 'TACTIC_STUDENT_CONFIG_SHOULD_DISPLAY_ACCENT_KEYBOARD',
};

function get(option: studentOptionType) {
    const value = localStorage.getItem(KEYS[option]) === 'true' || false;
    return value;
}

function set(option: studentOptionType, value: boolean) {
    localStorage.setItem(KEYS[option], value ? 'true' : 'false');
}

const studentConfigHandler = { get, set };

export { studentConfigHandler };
export type { studentOptionType };
