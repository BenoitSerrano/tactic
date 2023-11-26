import { extractEmailsFromEmailList } from './extractEmailsFromEmailList';

describe('extractEmailsFromEmailList', () => {
    it('should extract the emails', () => {
        const emailList = `a@truc.d
test test2, test3`;
        const emails = extractEmailsFromEmailList(emailList);

        expect(emails).toEqual(['a@truc.d', 'test', 'test2', 'test3']);
    });
});
