import { splitQuestionTrou } from './splitQuestionTrou';

describe('splitQuestionTrou', () => {
    describe('splitQuestionTrou', () => {
        it('Avec simples points de suspension', () => {
            expect(splitQuestionTrou('Voici un ... trou')).toEqual({
                beforeText: 'Voici un',
                afterText: 'trou',
            });
        });

        it('Avec des points de suspension, et des points dans la phrase', () => {
            expect(splitQuestionTrou('Voici un ... trou. Et une autre phrase.')).toEqual({
                beforeText: 'Voici un',
                afterText: 'trou. Et une autre phrase.',
            });
        });

        it('Avec points de suspension exotiques', () => {
            expect(splitQuestionTrou('Voici un ...…... trou')).toEqual({
                beforeText: 'Voici un',
                afterText: 'trou',
            });
        });

        it('Sans points de suspension du tout', () => {
            expect(splitQuestionTrou('Ne voici pas de trou')).toEqual(undefined);
        });
    });
});
