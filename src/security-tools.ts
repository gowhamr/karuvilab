/* ===== security-tools.ts – Password, Hash, JWT ===== */

const SecurityTools = (() => {

  function generatePassword(
    length: number = 16,
    options: PasswordOptions = { upper: true, lower: true, number: true, symbol: true }
  ): string {
    const charset: Record<keyof PasswordOptions, string> = {
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

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    return password;
  }

  function getPasswordStrength(password: string): PasswordStrength {
    let score = 0;
    if (!password) return { score: 0, label: 'Empty', color: '#6b7280', pct: 0 };

    if (password.length > 8)  score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password))      score++;
    if (/[a-z]/.test(password))      score++;
    if (/[0-9]/.test(password))      score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels: PasswordStrength[] = [
      { score, label: 'Very Weak', color: '#ef4444', pct: 20 },
      { score, label: 'Weak',      color: '#f97316', pct: 40 },
      { score, label: 'Fair',      color: '#eab308', pct: 60 },
      { score, label: 'Good',      color: '#84cc16', pct: 80 },
      { score, label: 'Strong',    color: '#22c55e', pct: 100 },
    ];

    const index = Math.min(Math.floor((score / 6) * levels.length), levels.length - 1);
    return { ...levels[index], score };
  }

  async function hashText(text: string, algorithm: string = 'SHA-256'): Promise<string> {
    const msgUint8   = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest(algorithm, msgUint8);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function decodeJWT(token: string): JWTDecodeResult {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');

      function decodePart(str: string): Record<string, unknown> | null {
        try {
          return JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
        } catch {
          return null;
        }
      }

      return {
        header:  decodePart(parts[0]) ?? undefined,
        payload: decodePart(parts[1]) ?? undefined,
        valid: true,
      };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  }

  return { generatePassword, getPasswordStrength, hashText, decodeJWT };
})();
