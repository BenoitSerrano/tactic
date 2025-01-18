const CHARACTERS_THAT_DONT_NEED_SPACE_BEFORE = ['-', '.', "'", ','];
function computeShouldDisplaySpaceBeforeCharacter(character: string): boolean {
    return !CHARACTERS_THAT_DONT_NEED_SPACE_BEFORE.includes(character);
}
export { computeShouldDisplaySpaceBeforeCharacter };
