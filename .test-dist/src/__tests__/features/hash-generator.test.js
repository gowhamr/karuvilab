import { describe, it, expect } from 'vitest';
describe('Hash Generator Native Tests', () => {
    const testVectors = [
        { algo: 'SHA3-256', input: 'abc', expected: '3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532' },
        { algo: 'SHA3-512', input: 'abc', expected: 'b751850b1a57168a5693cd924b6b096e08f621827444f70d884f5d0240d2712e10e116e9192af3c91a7ec57647e3934057340b4cf408d5a56592f8274eec53f0' },
        { algo: 'BLAKE3', input: 'abc', expected: '6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85' },
    ];
    it('verifies test vectors for new algorithms', async () => {
        const { createSHA3, createBLAKE3 } = await import('hash-wasm');
        for (const vector of testVectors) {
            let hasher;
            if (vector.algo === 'SHA3-256')
                hasher = await createSHA3(256);
            else if (vector.algo === 'SHA3-512')
                hasher = await createSHA3(512);
            else if (vector.algo === 'BLAKE3')
                hasher = await createBLAKE3();
            hasher.init();
            hasher.update(vector.input);
            const result = hasher.digest('hex');
            expect(result).toBe(vector.expected);
        }
    });
});
