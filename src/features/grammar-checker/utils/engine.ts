// @ts-ignore
import nspell from 'nspell';
import nlp from 'compromise';
import { syllable } from 'syllable';

let spellchecker: nspell | null = null;

async function loadSpellchecker() {
  if (spellchecker) return spellchecker;
  
  let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (typeof self !== 'undefined' && self.location && self.location.hostname.includes('github.io')) {
    basePath = '/karuvilab';
  }
  
  const affRes = await fetch(`${basePath}/lib/dictionary/en.aff`);
  const dicRes = await fetch(`${basePath}/lib/dictionary/en.dic`);
  
  if (!affRes.ok || !dicRes.ok) {
    throw new Error('Failed to load spellchecker dictionaries');
  }

  const aff = await affRes.text();
  const dic = await dicRes.text();
  
  spellchecker = nspell(aff, dic);
  return spellchecker;
}

export async function runGrammarCheck(text: string, ignoredWords: string[] = [], tone: string = 'standard', onProgress?: any) {
  if (!text.trim()) {
    return {
      errors: [],
      stats: { words: 0, characters: 0, sentences: 0, readabilityScore: 0, readingTimeMs: 0 }
    };
  }

  if (onProgress) onProgress({ percent: 30, message: "Loading dictionaries..." });
  const spell = await loadSpellchecker();
  
  if (onProgress) onProgress({ percent: 50, message: "Analyzing text..." });
  
  const errors: Array<{
    id: string;
    message: string;
    replacements: string[];
    offset: number;
    length: number;
    type: 'spelling' | 'grammar' | 'style' | 'readability';
  }> = [];

  const doc = nlp(text);
  
  // 1. Spelling
  // Use regex to find words and their exact offsets since compromise terms() offsets might not match raw string perfectly if there are special characters.
  const wordRegex = /\b[a-zA-Z']+\b/g;
  let match;
  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    const isCapitalized = /^[A-Z]/.test(word);
    
    // Ignore all-caps acronyms or very short words that are just numbers/symbols
    if (word.toUpperCase() === word && word.length > 1) continue;

    // Check ignore list
    if (ignoredWords.includes(word.toLowerCase())) continue;

    if (!spell.correct(word)) {
      const suggestions = spell.suggest(word).slice(0, 3);
      errors.push({
        id: `spell-${match.index}`,
        message: `Possible spelling mistake: "${word}"`,
        replacements: suggestions,
        offset: match.index,
        length: word.length,
        type: 'spelling'
      });
    }
  }

  // 2. Passive Voice Detection (using compromise)
  const passive = (doc.verbs() as any).isPassive();
  passive.forEach((p: any) => {
    const start = p.out('offset')[0].offset.start;
    const end = p.out('offset')[0].offset.length;
    errors.push({
      id: `passive-${start}`,
      message: "Passive voice detected. Consider rewriting in active voice.",
      replacements: [],
      offset: start,
      length: end,
      type: 'style'
    });
  });

  // 3. Weasel words / Filler words
  const weasels = ['very', 'really', 'just', 'basically', 'actually', 'literally'];
  weasels.forEach(w => {
    const found = doc.match(w);
    found.forEach((f: any) => {
      const start = f.out('offset')[0].offset.start;
      const end = f.out('offset')[0].offset.length;
      errors.push({
        id: `weasel-${start}`,
        message: `"${w}" is a filler word that weakens your sentence.`,
        replacements: [],
        offset: start,
        length: end,
        type: 'style'
      });
    });
  });

  // Tone-specific checks
  if (tone === 'formal' || tone === 'academic') {
    // Flag informal contractions
    const contractions = doc.contractions();
    contractions.forEach((c: any) => {
      const start = c.out('offset')[0].offset.start;
      const end = c.out('offset')[0].offset.length;
      errors.push({
        id: `contraction-${start}`,
        message: `Informal contraction used in ${tone} tone.`,
        replacements: [c.out('normal')],
        offset: start,
        length: end,
        type: 'style'
      });
    });
    
    // Flag first-person pronouns in academic mode
    if (tone === 'academic') {
      const pronouns = doc.match('(i|me|my|mine|we|us|our)');
      pronouns.forEach((p: any) => {
        const start = p.out('offset')[0].offset.start;
        const end = p.out('offset')[0].offset.length;
        errors.push({
          id: `pronoun-${start}`,
          message: "First-person pronouns are typically avoided in academic writing.",
          replacements: [],
          offset: start,
          length: end,
          type: 'style'
        });
      });
    }
  } else if (tone === 'casual') {
    // Flag overly complex words (> 4 syllables)
    doc.terms().forEach((t: any) => {
      const word = t.text('normal');
      if (syllable(word) > 4) {
        const start = t.out('offset')[0].offset.start;
        const end = t.out('offset')[0].offset.length;
        errors.push({
          id: `complex-${start}`,
          message: `Very complex word for a casual tone.`,
          replacements: [],
          offset: start,
          length: end,
          type: 'style'
        });
      }
    });
  }

  // 4. Repeated Words ("the the")
  const duplicateRegex = /\b(\w+)\s+\1\b/gi;
  while ((match = duplicateRegex.exec(text)) !== null) {
    errors.push({
      id: `dup-${match.index}`,
      message: `Repeated word: "${match[1]}"`,
      replacements: [match[1] || ''],
      offset: match.index,
      length: match[0].length,
      type: 'grammar'
    });
  }

  // 5. Stats & Readability (Flesch-Kincaid)
  if (onProgress) onProgress({ percent: 80, message: "Calculating readability..." });
  
  const sentences = doc.sentences().length || 1;
  const words = doc.terms().length || 1;
  const characters = text.length;
  
  let totalSyllables = 0;
  doc.terms().out('array').forEach((t: string) => {
    totalSyllables += syllable(t);
  });

  // Flesch Reading Ease
  // 206.835 - 1.015 * (Total Words / Total Sentences) - 84.6 * (Total Syllables / Total Words)
  const readabilityScore = Math.max(0, Math.min(100, Math.round(
    206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words)
  )));

  // Average reading speed: 200 words per minute -> ~3.3 words per second
  const readingTimeMs = Math.round((words / 200) * 60 * 1000);

  if (onProgress) onProgress({ percent: 100, message: "Done" });

  return {
    errors,
    stats: {
      words,
      characters,
      sentences,
      readabilityScore,
      readingTimeMs
    }
  };
}
