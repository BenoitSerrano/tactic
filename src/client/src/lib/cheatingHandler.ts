import { api } from './api';
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

function buildOnFocusChangeCallback(kind: focusChangeEventType['kind']) {
    return (pathname: string) => {
        const currentAttemptId = pathHandler.extractCurrentAttemptId(pathname);
        if (!!currentAttemptId) {
            const now = new Date();
            const previousFocusChangesEvent = localStorage.focusChanges.get(currentAttemptId);

            const nextFocusChangesEvent = [
                ...previousFocusChangesEvent,
                { kind, timestamp: now.getTime() },
            ];
            localStorage.focusChanges.set(currentAttemptId, nextFocusChangesEvent);
            if (kind === 'focus') {
                const cheatingSummary = computeCheatingSummary(nextFocusChangesEvent);
                if (!!cheatingSummary) {
                    api.updateAttemptCheatingSummary({
                        attemptId: currentAttemptId,
                        ...cheatingSummary,
                    });
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
