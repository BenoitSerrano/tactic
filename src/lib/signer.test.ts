import { signer } from './signer';

describe('signer', () => {
    describe('sign', () => {
        it('should create a token', () => {
            const payload = { foo: 'bar' };

            const token = signer.sign(payload);
            const [header, body, _] = token.split('.');
            const value = JSON.parse(atob(body))['foo'];

            expect(header).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
            expect(value).toBe('bar');
        });

        it('should verify a token', () => {
            const payload = { foo: 'bar' };

            const token = signer.sign(payload);
            const value = (signer.verify(token) as Record<string, any>)['foo'];

            expect(value).toBe('bar');
        });
    });
});
