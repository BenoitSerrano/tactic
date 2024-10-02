import { jwtTokenHandler } from './jwtTokenHandler';
import { focusChanges } from './focusChanges';
import { studentConfigHandler, studentOptionType } from './studentConfigHandler';

const localStorage = { jwtTokenHandler, focusChanges, studentConfigHandler };

export type { studentOptionType };
export { localStorage };
