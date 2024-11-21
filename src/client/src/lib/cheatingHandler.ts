import { attemptsApi } from './api/attemptsApi';
import { localStorage } from './localStorage';
import { pathHandler } from './pathHandler';

type cheatingSummaryType = {
    timeSpentOutside: number;
    roundTrips: number;
};

type focusChangeEventType = { kind: 'focus' | 'blur'; timestamp: number };

const cheatingHandler = {
    buildOnFocusChangeCallback,
    areFocusChangesEventConsistent,
    computeCheatingSummary,
};

function buildOnFocusChangeCallback(kind: focusChangeEventType['kind'], displayAlert: () => void) {
    return async (pathname: string) => {
        const currentAttemptId = pathHandler.extractCurrentAttemptId(pathname);
        if (!!currentAttemptId) {
            displayAlert();

            const now = new Date();
            const previousFocusChangesEvents = localStorage.focusChanges.get(currentAttemptId);
            const nextFocusChangesEvent = { kind, timestamp: now.getTime() };

            const nextFocusChangesEvents = [...previousFocusChangesEvents];

            // in case of a bug, i.e. there is a double event "blur" or "focus", we delete the previous one
            if (
                nextFocusChangesEvents.length > 0 &&
                nextFocusChangesEvents[nextFocusChangesEvents.length - 1].kind === kind
            ) {
                nextFocusChangesEvents.splice(nextFocusChangesEvents.length - 1, 1);
            }

            nextFocusChangesEvents.push(nextFocusChangesEvent);
            localStorage.focusChanges.set(currentAttemptId, nextFocusChangesEvents);
            if (kind === 'focus') {
                const cheatingSummary = computeCheatingSummary(nextFocusChangesEvents);
                if (!!cheatingSummary) {
                    try {
                        await attemptsApi.updateAttemptCheatingSummary({
                            attemptId: currentAttemptId,
                            ...cheatingSummary,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    };
}

function computeCheatingSummary(
    focusChanges: focusChangeEventType[],
): cheatingSummaryType | undefined {
    const cheatingSummary = { roundTrips: 0, timeSpentOutside: 0 };
    if (!areFocusChangesEventConsistent(focusChanges)) {
        return undefined;
    }

    if (focusChanges.length <= 1) {
        return cheatingSummary;
    }

    for (let i = 1, l = focusChanges.length; i < l; i++) {
        if (i % 2 === 1) {
            // event is "focus"
            const elapsedTime = focusChanges[i].timestamp - focusChanges[i - 1].timestamp;
            cheatingSummary.timeSpentOutside += elapsedTime;
            cheatingSummary.roundTrips++;
        }
    }

    return cheatingSummary;
}

function areFocusChangesEventConsistent(focusChanges: focusChangeEventType[]): boolean {
    let lastTimestamp = 0;
    for (let i = 0, l = focusChanges.length; i < l; i++) {
        if (i % 2 === 0 && focusChanges[i].kind !== 'blur') {
            return false;
        }
        if (i % 2 === 1 && focusChanges[i].kind !== 'focus') {
            return false;
        }
        if (focusChanges[i].timestamp < lastTimestamp) {
            return false;
        }
        lastTimestamp = focusChanges[i].timestamp;
    }
    return true;
}

export { cheatingHandler };

export type { focusChangeEventType };
