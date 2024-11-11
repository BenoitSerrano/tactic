import { jwtTokenHandler } from './jwtTokenHandler';
import { focusChanges } from './focusChanges';
import { studentConfigHandler, studentOptionType } from './studentConfigHandler';
import { userInfoHandler } from './userInfoHandler';
import { lastPageVisitedHandler } from './lastPageVisitedHandler';

const localStorage = {
    jwtTokenHandler,
    focusChanges,
    studentConfigHandler,
    userInfoHandler,
    lastPageVisitedHandler,
};

export type { studentOptionType };
export { localStorage };
