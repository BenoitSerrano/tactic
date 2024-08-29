import { replaceVariableInText } from './replaceVariableInText';

describe('replaceVariableInText', () => {
    it('should change nothing', () => {
        const initialText = 'BIDULE';
        const variables = { duration: 10 };

        const formattedText = replaceVariableInText(initialText, variables);

        expect(formattedText).toBe('BIDULE');
    });

    it('should replace the variable', () => {
        const initialText = '{{duration}} minutes';
        const variables = { duration: 10 };

        const formattedText = replaceVariableInText(initialText, variables);

        expect(formattedText).toBe('10 minutes');
    });

    it('should not display anything if variable is undefined or null', () => {
        const initialText = '{{duration}} minutes';
        const variables = { duration: undefined };

        const formattedText = replaceVariableInText(initialText, variables);

        expect(formattedText).toBe(' minutes');
    });

    it('should replace the variable but not the one not passed', () => {
        const initialText = '{{duration}} minutes {{seconds}} seconds';
        const variables = { duration: 10 };

        const formattedText = replaceVariableInText(initialText, variables);

        expect(formattedText).toBe('10 minutes {{seconds}} seconds');
    });
});
