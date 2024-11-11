import { punctuationSpacesHandler } from './punctationSpacesHandler';

describe('punctuationSpacesHandler', () => {
    describe('addSpaces', () => {
        it('should not do anything if no punctuation', () => {
            const displayedTitle = 'la vie est belle';

            const displayedTitleWithSpaces = punctuationSpacesHandler.addSpaces(displayedTitle);

            expect(displayedTitleWithSpaces).toBe(displayedTitle);
        });

        it('should a space if punctuation is present', () => {
            const displayedTitle = 'la vie, la vraie   , la nulle';

            const displayedTitleWithSpaces = punctuationSpacesHandler.addSpaces(displayedTitle);

            expect(displayedTitleWithSpaces).toBe('la vie , la vraie , la nulle');
        });
    });
});
