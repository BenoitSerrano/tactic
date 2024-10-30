import { jwtTokenHandler } from './jwtTokenHandler';
import { focusChanges } from './focusChanges';
import { studentConfigHandler, studentOptionType } from './studentConfigHandler';
import { userInfoHandler } from './userInfoHandler';
const localStorage = { jwtTokenHandler, focusChanges, studentConfigHandler, userInfoHandler };

export type { studentOptionType };
export { localStorage };
