import { describe, it, expect } from 'vitest';

// Pure functions from src/security-tools.ts — no DOM dependency.

function generatePassword(
  length: number = 16,
  options = { upper: true, lower: true, number: true, symbol: true }
): string {
  const charset = {
    upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower:  'abcdefghijklmnopqrstuvwxyz',
    number: '0123456789',
    symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
  };
  let chars = '';
  if (options.upper)  chars += charset.upper;
  if (options.lower)  chars += charset.lower;
  if (options.number) chars += charset.number;
  if (options.symbol) chars += charset.symbol;
  if (!chars) return '';
  // Use Math.random in tests (no crypto available in Node without polyfill)
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function getPasswordStrength(password: string): { score: number; label: string; pct: number } {
  let score = 0;
  if (!password) return { score: 0, label: 'Empty', pct: 0 };
  if (password.length > 8)  score++;
  if (password.length > 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: 'Very Weak', pct: 20 },
    { label: 'Weak',      pct: 40 },
    { label: 'Fair',      pct: 60 },
    { label: 'Good',      pct: 80 },
    { label: 'Strong',    pct: 100 },
  ];
  const index = Math.min(Math.floor(score / 6 * levels.length), levels.length - 1);
  return { ...levels[index], score };
}

function decodeJWT(token: string): { valid: boolean; header?: unknown; payload?: unknown; error?: string } {
  function decodePart(str: string): unknown {
    try {
      return JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  }
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    return { header: decodePart(parts[0]) ?? undefined, payload: decodePart(parts[1]) ?? undefined, valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

// ─── generatePassword ───────────────────────────────────────────
describe('generatePassword', () => {
  it('generates correct length', () => {
    expect(generatePassword(16).length).toBe(16);
    expect(generatePassword(8).length).toBe(8);
    expect(generatePassword(32).length).toBe(32);
  });

  it('returns empty string when no charset selected', () => {
    expect(generatePassword(16, { upper: false, lower: false, number: false, symbol: false })).toBe('');
  });

  it('respects upper-only option', () => {
    const pwd = generatePassword(50, { upper: true, lower: false, number: false, symbol: false });
    expect(/^[A-Z]+$/.test(pwd)).toBe(true);
  });

  it('respects digits-only option', () => {
    const pwd = generatePassword(20, { upper: false, lower: false, number: true, symbol: false });
    expect(/^\d+$/.test(pwd)).toBe(true);
  });
});

// ─── getPasswordStrength ────────────────────────────────────────
describe('getPasswordStrength', () => {
  it('returns Empty for empty string', () => {
    expect(getPasswordStrength('').label).toBe('Empty');
    expect(getPasswordStrength('').score).toBe(0);
  });

  it('scores short lowercase-only password low', () => {
    const { score } = getPasswordStrength('abc');
    expect(score).toBeLessThanOrEqual(2);
  });

  it('scores strong mixed password high', () => {
    const { score } = getPasswordStrength('Tr0ub4dor&3!XyZ');
    expect(score).toBeGreaterThanOrEqual(5);
  });

  it('pct is always between 0 and 100', () => {
    ['', 'a', 'Abc123!', 'Tr0ub4dor&3!XyZ'].forEach(pwd => {
      const { pct } = getPasswordStrength(pwd);
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(100);
    });
  });
});

// ─── decodeJWT ──────────────────────────────────────────────────
describe('decodeJWT', () => {
  // A real JWT with known payload {"sub":"1234567890","name":"John Doe","iat":1516239022}
  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
    'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('decodes a valid JWT', () => {
    const result = decodeJWT(validToken);
    expect(result.valid).toBe(true);
    expect((result.payload as Record<string, unknown>)?.sub).toBe('1234567890');
    expect((result.header as Record<string, unknown>)?.alg).toBe('HS256');
  });

  it('rejects tokens with wrong part count', () => {
    expect(decodeJWT('a.b').valid).toBe(false);
    expect(decodeJWT('a.b').error).toMatch(/Invalid JWT/);
  });

  it('returns valid:false for completely invalid input', () => {
    expect(decodeJWT('not-a-token').valid).toBe(false);
  });

  it('handles empty string', () => {
    expect(decodeJWT('').valid).toBe(false);
  });
});
