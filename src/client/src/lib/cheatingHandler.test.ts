import { cheatingHandler, focusChangeEventType } from './cheatingHandler';

describe('cheatingHandler', () => {
    describe('computeCheatingSummary', () => {
        it('should compute the cheating summary when there is none', () => {
            const focusChangesEvent: focusChangeEventType[] = [];

            const cheatingSummary = cheatingHandler.computeCheatingSummary(focusChangesEvent);

            expect(cheatingSummary).toEqual({ roundTrips: 0, timeSpentOutside: 0 });
        });

        it('should compute the cheating summary with two cheatings', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599179311 },
                { kind: 'blur', timestamp: 1693599370000 },
                { kind: 'focus', timestamp: 1693599380000 },
            ];

            const cheatingSummary = cheatingHandler.computeCheatingSummary(focusChangesEvent);

            expect(cheatingSummary).toEqual({ roundTrips: 2, timeSpentOutside: 11000 });
        });

        it('should compute the cheating summary with two cheatings and a traling blur', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599179311 },
                { kind: 'blur', timestamp: 1693599370000 },
                { kind: 'focus', timestamp: 1693599380000 },
                { kind: 'blur', timestamp: 1793599380000 },
            ];

            const cheatingSummary = cheatingHandler.computeCheatingSummary(focusChangesEvent);

            expect(cheatingSummary).toEqual({ roundTrips: 2, timeSpentOutside: 11000 });
        });

        it('should compute the cheating summary with one cheating', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599179311 },
            ];

            const cheatingSummary = cheatingHandler.computeCheatingSummary(focusChangesEvent);

            expect(cheatingSummary).toEqual({ roundTrips: 1, timeSpentOutside: 1000 });
        });
    });

    describe('areFocusChangesEventConsistent', () => {
        it('should return true if empty', () => {
            const focusChangesEvent: focusChangeEventType[] = [];

            const result = cheatingHandler.areFocusChangesEventConsistent(focusChangesEvent);

            expect(result).toBe(true);
        });

        it('should true if consistent', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599179311 },
                { kind: 'blur', timestamp: 1693599370000 },
                { kind: 'focus', timestamp: 1693599380000 },
            ];

            const result = cheatingHandler.areFocusChangesEventConsistent(focusChangesEvent);

            expect(result).toBe(true);
        });

        it('should true if consistent and a trailing blur', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599179311 },
                { kind: 'blur', timestamp: 1693599370000 },
                { kind: 'focus', timestamp: 1693599380000 },
                { kind: 'blur', timestamp: 1693599480000 },
            ];

            const result = cheatingHandler.areFocusChangesEventConsistent(focusChangesEvent);

            expect(result).toBe(true);
        });

        it('should false if timestamp not in increasing order', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599370000 },
                { kind: 'blur', timestamp: 1693599179311 },
                { kind: 'focus', timestamp: 1693599380000 },
                { kind: 'blur', timestamp: 1693599480000 },
            ];

            const result = cheatingHandler.areFocusChangesEventConsistent(focusChangesEvent);

            expect(result).toBe(false);
        });

        it('should false if events not alternating', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'blur', timestamp: 1693599178311 },
                { kind: 'focus', timestamp: 1693599179311 },
                { kind: 'blur', timestamp: 1693599370000 },
                { kind: 'blur', timestamp: 1693599380000 },
                { kind: 'focus', timestamp: 1693599480000 },
            ];

            const result = cheatingHandler.areFocusChangesEventConsistent(focusChangesEvent);

            expect(result).toBe(false);
        });

        it('should false if blur not the first event', () => {
            const focusChangesEvent: focusChangeEventType[] = [
                { kind: 'focus', timestamp: 1693599179311 },
                { kind: 'blur', timestamp: 1693599370000 },
                { kind: 'focus', timestamp: 1693599380000 },
                { kind: 'blur', timestamp: 1693599480000 },
            ];

            const result = cheatingHandler.areFocusChangesEventConsistent(focusChangesEvent);

            expect(result).toBe(false);
        });
    });
});
