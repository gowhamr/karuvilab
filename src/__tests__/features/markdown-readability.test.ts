import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { countSyllablesInWord, calculateReadability } from '../../features/markdown/utils/readability';

describe('Markdown Readability & Timing Metrics', () => {
  it('counts syllables in words accurately', () => {
    assert.equal(countSyllablesInWord('cat'), 1);
    assert.equal(countSyllablesInWord('water'), 2);
    assert.equal(countSyllablesInWord('computer'), 3);
    assert.equal(countSyllablesInWord('engineering'), 4);
  });

  it('calculates reading time and speaking time correctly', () => {
    // 260 words broken into 15 natural sentences
    const sentences = Array.from({ length: 15 }, (_, i) => `This is sentence number ${i + 1} with simple clear words to test readability.`).join(' ');
    const metrics = calculateReadability(sentences);

    assert.ok(metrics.words >= 150);
    assert.ok(metrics.readingTimeMin >= 1);
    assert.ok(metrics.speakingTimeMin >= 1);
    assert.ok(metrics.fleschScore > 50);
  });

  it('ignores code blocks, html tags, and formatting in readability prose analysis', () => {
    const md = `
# Title

\`\`\`javascript
const longCode = "some long technical snippet with lots of words and symbols";
function calculate() { return 42; }
\`\`\`

Here is a simple sentence for readers. And here is a second clean sentence.
`;

    const metrics = calculateReadability(md);
    assert.equal(metrics.sentences, 2);
    assert.ok(metrics.words > 0 && metrics.words < 25);
  });

  it('handles empty input gracefully', () => {
    const metrics = calculateReadability('');
    assert.equal(metrics.words, 0);
    assert.equal(metrics.readingTimeMin, 0);
    assert.equal(metrics.speakingTimeMin, 0);
  });
});
