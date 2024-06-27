import { localeHandler } from './localeHandler';

function buildFormatNumber(locale: string) {
    return formatNumber;
    function formatNumber(value: number) {
        return value.toLocaleString(locale);
    }
}

const locale = localeHandler.getLocale();

const formatNumber = buildFormatNumber(locale);

export { formatNumber, buildFormatNumber };
