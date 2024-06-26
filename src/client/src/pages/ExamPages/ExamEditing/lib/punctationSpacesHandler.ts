const punctuationSpacesHandler = {
    addSpaces,
};

// eslint-disable-next-line no-useless-escape
const PONCTUATION_SIGNS = [','];
const SURNUMEROUS_SPACES_REGEX = new RegExp(`  +`, 'g');

function addSpaces(displayedTitle: string) {
    let displayedTitleWithSpaces = displayedTitle;
    for (const PONCTUATION_SIGN of PONCTUATION_SIGNS) {
        const PONCTUATION_REGEX = new RegExp(`${PONCTUATION_SIGN}`, 'g');
        displayedTitleWithSpaces = displayedTitleWithSpaces.replace(
            PONCTUATION_REGEX,
            ` ${PONCTUATION_SIGN} `,
        );
    }
    displayedTitleWithSpaces = displayedTitleWithSpaces.replace(SURNUMEROUS_SPACES_REGEX, ' ');
    return displayedTitleWithSpaces;
}

export { punctuationSpacesHandler };
