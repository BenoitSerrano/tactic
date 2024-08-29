function replaceVariableInText(
    initialText: string,
    variables: Record<string, string | number | null | undefined>,
) {
    let newText = initialText;
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');

        const newValue = value !== undefined && value !== null ? `${value}` : '';
        newText = newText.replace(regex, newValue);
    });
    return newText;
}

export { replaceVariableInText };
