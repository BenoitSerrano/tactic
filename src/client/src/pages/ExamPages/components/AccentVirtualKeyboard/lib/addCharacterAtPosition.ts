function addCharacterAtPosition(characterToAdd: string, position: number, text: string) {
    const newText = text.slice(0, position) + characterToAdd + text.slice(position);
    return newText;
}

export { addCharacterAtPosition };
