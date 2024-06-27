import { buildFormatNumber } from './formatNumber';

describe('formatNumber', () => {
    describe('American', () => {
        const locale = 'en-US';
        const formatNumber = buildFormatNumber(locale);

        it('should return american formatted number for decimal', () => {
            const value = 10.5;

            const formattedValue = formatNumber(value);

            expect(formattedValue).toEqual('10.5');
        });

        it('should return american formatted number for thousands', () => {
            const value = 1002;

            const formattedValue = formatNumber(value);

            expect(formattedValue).toEqual('1,002');
        });
    });

    describe('French', () => {
        const locale = 'fr-FR';
        const formatNumber = buildFormatNumber(locale);

        it('should return french formatted number for decimal', () => {
            const value = 10.5;

            const formattedValue = formatNumber(value);

            expect(formattedValue).toEqual('10,5');
        });

        it('should return french formatted number for thousands', () => {
            const value = 1002;

            const formattedValue = formatNumber(value);

            expect(formattedValue).toBe('1 002');
        });
    });
});
