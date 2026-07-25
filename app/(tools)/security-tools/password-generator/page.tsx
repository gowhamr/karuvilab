import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import PasswordGeneratorClientWrapper from './PasswordGeneratorClientWrapper';

const toolId = 'password-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Password Generator"
      description="Generate strong, random passwords with customizable options."
      category={cat}
      toolId={toolId}
    >
      <PasswordGeneratorClientWrapper />

      <LearningHub title="Password Entropy & PRNGs" description="Learn how password strength is calculated mathematically and why pseudo-random number generators are critical to security.">
        
        <LearningSection type="architecture" title="Calculating Entropy" fullWidth>
          <p>
            Password strength is measured in <strong>Entropy (bits)</strong>. It defines how many guesses a computer would need to brute-force the password.
          </p>
          <p className="mt-2">
            The formula is <code>E = L * log2(R)</code>, where <code>L</code> is the length of the password and <code>R</code> is the pool of possible characters.
            For example, an 8-character password using only lowercase letters (pool of 26) has ~37 bits of entropy. A 16-character password using uppercase, lowercase, numbers, and symbols (pool of ~70) has ~98 bits of entropy.
          </p>
          <p className="mt-2">
            Modern security standards recommend at least <strong>80-100 bits of entropy</strong> to withstand offline brute-force attacks using dedicated GPU clusters.
          </p>
        </LearningSection>

        <LearningSection type="security" title="CSPRNGs vs Math.random()">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pseudo-Randomness:</strong> Computers are deterministic; they cannot generate true randomness natively. They use math formulas seeded by a starting value to generate "Pseudo-Random" numbers.</li>
            <li><strong>Math.random():</strong> Uses a weak algorithm (like XorShift). If a hacker observes a few outputs, they can calculate the internal seed and predict every future password generated. Never use it for security.</li>
            <li><strong>CSPRNG:</strong> A Cryptographically Secure Pseudo-Random Number Generator uses entropy from physical hardware (CPU thermal noise, mouse movements, disk seek times) via the OS kernel (<code>/dev/urandom</code>).</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Browser Crypto API">
          <p>
            This tool uses <code>window.crypto.getRandomValues()</code> to fetch true secure randomness from the browser's CSPRNG. We then use modular arithmetic to map those random bytes securely onto the requested character sets.
          </p>
        </LearningSection>

        <LearningSection type="failures" title="Modulo Bias">
          <p>
            A common bug when building custom password generators is <strong>Modulo Bias</strong>.
          </p>
          <p className="mt-2">
            If you generate a random byte (0-255) and do <code>% 62</code> to pick a character, the numbers 0-7 will be selected more frequently than the others because 256 is not evenly divisible by 62. Secure generators must discard random values that fall in the uneven upper bound to ensure perfect uniformity.
          </p>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="According to password entropy math, which change increases password strength MORE?"
            options={[
              { id: "a", text: "Adding 1 extra character to the length of the password.", isCorrect: true, explanation: "Correct! Because length is an exponent in the total combinations formula (R^L), increasing length provides a massive, exponential increase in strength compared to adding a few symbols to the pool." },
              { id: "b", text: "Adding 10 new symbols (!@#$) to the pool of allowed characters.", isCorrect: false, explanation: "While this helps, increasing the pool size provides a logarithmic increase in entropy, whereas increasing length provides a linear increase in bits (which means exponential brute-force resistance)." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
