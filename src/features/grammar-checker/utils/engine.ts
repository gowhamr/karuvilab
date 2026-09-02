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

export interface GrammarError {
  id: string;
  message: string;
  replacements: string[];
  offset: number;
  length: number;
  type: 'spelling' | 'grammar' | 'style' | 'readability';
}

export async function runGrammarCheck(
  text: string, 
  ignoredWords: string[] = [], 
  tone: string = 'standard', 
  onProgress?: (p: { percent: number; message: string }) => void
) {
  if (!text.trim()) {
    return {
      errors: [],
      stats: { 
        words: 0, 
        characters: 0, 
        sentences: 0, 
        paragraphs: 0, 
        readabilityScore: 0, 
        readabilityGrade: 'Easy (Grade 5-6)', 
        readingTimeMs: 0, 
        avgSentenceLength: 0, 
        uniqueWords: 0 
      }
    };
  }

  if (onProgress) onProgress({ percent: 30, message: "Loading dictionaries..." });
  const spell = await loadSpellchecker();
  
  if (onProgress) onProgress({ percent: 50, message: "Analyzing text..." });
  
  const rawErrors: GrammarError[] = [];
  const doc = nlp(text);
  
  // 1. Spelling Check
  const wordRegex = /\b[a-zA-Z']+\b/g;
  let match: RegExpExecArray | null;
  const lowerIgnored = new Set(ignoredWords.map(w => w.toLowerCase()));

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    
    // Ignore pure uppercase acronyms (e.g., NASA, HTML)
    if (word.toUpperCase() === word && word.length > 1) continue;
    if (lowerIgnored.has(word.toLowerCase())) continue;

    if (!spell.correct(word)) {
      const suggestions = (spell.suggest(word) || [])
        .slice(0, 3)
        .filter((s: string) => s.toLowerCase() !== word.toLowerCase());

      rawErrors.push({
        id: `spell-${match.index}`,
        message: `Possible spelling mistake: "${word}"`,
        replacements: suggestions,
        offset: match.index,
        length: word.length,
        type: 'spelling'
      });
    }
  }

  // 2. Passive Voice Detection
  const passive = doc.match('(#Copula|#Auxiliary) #Adverb? #Participle');
  const passiveOffsets = passive.out('offset');
  if (Array.isArray(passiveOffsets)) {
    passiveOffsets.forEach((o: any) => {
      const start = o.offset?.start ?? o.start;
      const length = o.offset?.length ?? o.length;
      if (typeof start === 'number' && typeof length === 'number' && length > 0) {
        rawErrors.push({
          id: `passive-${start}`,
          message: "Passive voice detected. Consider rewriting in active voice.",
          replacements: [],
          offset: start,
          length: length,
          type: 'style'
        });
      }
    });
  }

  // 3. Weasel words / Filler words
  const weasels = ['very', 'really', 'just', 'basically', 'actually', 'literally'];
  for (const w of weasels) {
    const wRegex = new RegExp(`\\b${w}\\b`, 'gi');
    let wMatch: RegExpExecArray | null;
    while ((wMatch = wRegex.exec(text)) !== null) {
      rawErrors.push({
        id: `weasel-${wMatch.index}`,
        message: `"${wMatch[0]}" is a filler word. Consider removing it for conciseness.`,
        replacements: [],
        offset: wMatch.index,
        length: wMatch[0].length,
        type: 'style'
      });
    }
  }

  // Tone-specific checks
  if (tone === 'formal' || tone === 'academic') {
    const contractions = doc.match('#Contraction');
    const cOffsets = contractions.out('offset');
    if (Array.isArray(cOffsets)) {
      cOffsets.forEach((o: any) => {
        const start = o.offset?.start ?? o.start;
        const length = o.offset?.length ?? o.length;
        if (typeof start === 'number' && typeof length === 'number' && length > 0) {
          rawErrors.push({
            id: `contraction-${start}`,
            message: `Avoid contractions ("${text.substring(start, start + length)}") in ${tone} writing.`,
            replacements: [],
            offset: start,
            length: length,
            type: 'style'
          });
        }
      });
    }
    
    if (tone === 'academic') {
      const pronouns = doc.match('(i|me|my|mine|we|us|our)');
      const pOffsets = pronouns.out('offset');
      if (Array.isArray(pOffsets)) {
        pOffsets.forEach((o: any) => {
          const start = o.offset?.start ?? o.start;
          const length = o.offset?.length ?? o.length;
          if (typeof start === 'number' && typeof length === 'number' && length > 0) {
            rawErrors.push({
              id: `pronoun-${start}`,
              message: "First-person pronouns are typically avoided in academic writing.",
              replacements: [],
              offset: start,
              length: length,
              type: 'style'
            });
          }
        });
      }
    }
  } else if (tone === 'casual') {
    doc.terms().forEach((t: any) => {
      const word = t.text('normal');
      if (syllable(word) > 4) {
        const offsets = t.out('offset');
        if (Array.isArray(offsets) && offsets.length > 0) {
          const start = offsets[0].offset?.start ?? offsets[0].start;
          const length = offsets[0].offset?.length ?? offsets[0].length;
          if (typeof start === 'number' && typeof length === 'number') {
            rawErrors.push({
              id: `complex-${start}`,
              message: `"${word}" is complex for a casual tone.`,
              replacements: [],
              offset: start,
              length: length,
              type: 'style'
            });
          }
        }
      }
    });
  }

  // 4. Repeated Words ("the the")
  const duplicateRegex = /\b([a-zA-Z]+)\s+\1\b/gi;
  while ((match = duplicateRegex.exec(text)) !== null) {
    const singleWord = match[1] || '';
    rawErrors.push({
      id: `dup-${match.index}`,
      message: `Repeated word: "${singleWord}"`,
      replacements: [singleWord],
      offset: match.index,
      length: match[0].length,
      type: 'grammar'
    });
  }

  // 5. A / An Article check
  const articleRegex = /\b(a|an)\s+([a-zA-Z]+)\b/gi;
  let aMatch: RegExpExecArray | null;
  while ((aMatch = articleRegex.exec(text)) !== null) {
    const article = (aMatch[1] || '').toLowerCase();
    const nextWord = (aMatch[2] || '').toLowerCase();
    const originalNextWord = aMatch[2] || '';

    const isVowelSound = /^[aeiou]/i.test(nextWord) || /^hour/i.test(nextWord) || /^honor/i.test(nextWord) || /^honest/i.test(nextWord);
    const isConsonantSound = /^u[a-z]*e/i.test(nextWord) || /^uni/i.test(nextWord) || /^eu/i.test(nextWord) || /^one/i.test(nextWord) || /^user/i.test(nextWord);
    const actuallyVowelSound = isVowelSound && !isConsonantSound;

    if (article === 'a' && actuallyVowelSound) {
      rawErrors.push({
        id: `article-${aMatch.index}`,
        message: `Use "an" before a vowel sound ("${originalNextWord}").`,
        replacements: [`an ${originalNextWord}`],
        offset: aMatch.index,
        length: aMatch[0].length,
        type: 'grammar'
      });
    } else if (article === 'an' && !actuallyVowelSound) {
      rawErrors.push({
        id: `article-${aMatch.index}`,
        message: `Use "a" before a consonant sound ("${originalNextWord}").`,
        replacements: [`a ${originalNextWord}`],
        offset: aMatch.index,
        length: aMatch[0].length,
        type: 'grammar'
      });
    }
  }

  // 6. Punctuation Rules
  const doubleSpaceRegex = / {2,}/g;
  let pMatch: RegExpExecArray | null;
  while ((pMatch = doubleSpaceRegex.exec(text)) !== null) {
    rawErrors.push({
      id: `punct-ds-${pMatch.index}`,
      message: "Multiple spaces detected.",
      replacements: [' '],
      offset: pMatch.index,
      length: pMatch[0].length,
      type: 'style'
    });
  }

  const missingSpaceRegex = /([.!?,;:])([A-Za-z])/g;
  while ((pMatch = missingSpaceRegex.exec(text)) !== null) {
    rawErrors.push({
      id: `punct-ms-${pMatch.index}`,
      message: "Missing space after punctuation mark.",
      replacements: [`${pMatch[1] || ''} ${pMatch[2] || ''}`],
      offset: pMatch.index,
      length: pMatch[0].length,
      type: 'style'
    });
  }

  const spaceBeforePunctRegex = / +([.!?,;:])/g;
  while ((pMatch = spaceBeforePunctRegex.exec(text)) !== null) {
    rawErrors.push({
      id: `punct-sp-${pMatch.index}`,
      message: "Unnecessary space before punctuation.",
      replacements: [pMatch[1] || ''],
      offset: pMatch.index,
      length: pMatch[0].length,
      type: 'style'
    });
  }

  // 7. Sentence Length Analysis
  doc.sentences().forEach((sentence: any) => {
    const wordCount = sentence.terms().length;
    const offsets = sentence.out('offset');
    if (Array.isArray(offsets) && offsets.length > 0) {
      const start = offsets[0].offset?.start ?? offsets[0].start;
      const length = offsets[0].offset?.length ?? offsets[0].length;
      if (typeof start === 'number' && typeof length === 'number') {
        if (wordCount > 40) {
          rawErrors.push({
            id: `slength-40-${start}`,
            message: `Very long sentence (${wordCount} words). Consider breaking it up.`,
            replacements: [],
            offset: start,
            length: length,
            type: 'readability'
          });
        } else if (wordCount > 28) {
          rawErrors.push({
            id: `slength-28-${start}`,
            message: `Long sentence (${wordCount} words). Consider simplifying.`,
            replacements: [],
            offset: start,
            length: length,
            type: 'readability'
          });
        }
      }
    }
  });

  // 8. Conciseness - Wordy Phrases
  const WORDY_PHRASES: Record<string, string> = {
    'in order to': 'to',
    'at this point in time': 'now',
    'due to the fact that': 'because',
    'in the event that': 'if',
    'a large number of': 'many',
    'in spite of the fact that': 'although',
    'at the present time': 'now',
    'for the purpose of': 'to',
    'in the near future': 'soon',
    'has the ability to': 'can',
    'have the ability to': 'can',
    'on a daily basis': 'daily',
    'with regard to': 'about',
    'it is important to note that': '',
    'in my opinion': '',
    'the fact that': 'that'
  };

  for (const [phrase, replacement] of Object.entries(WORDY_PHRASES)) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    let wpMatch: RegExpExecArray | null;
    while ((wpMatch = regex.exec(text)) !== null) {
      rawErrors.push({
        id: `wordy-${wpMatch.index}`,
        message: `Wordy phrase: "${wpMatch[0]}". Consider replacing it.`,
        replacements: replacement === '' ? [] : [replacement],
        offset: wpMatch.index,
        length: wpMatch[0].length,
        type: 'style'
      });
    }
  }

  // 9. Word Choice - Weak Words in formal/academic
  const WEAK_WORDS: Record<string, string[]> = {
    'good': ['excellent', 'effective', 'beneficial'],
    'bad': ['poor', 'inadequate', 'detrimental'],
    'big': ['significant', 'substantial', 'considerable'],
    'small': ['minor', 'slight', 'compact'],
    'get': ['obtain', 'acquire', 'receive'],
    'thing': ['aspect', 'element', 'factor'],
    'nice': ['pleasant', 'admirable', 'commendable'],
    'stuff': ['materials', 'items', 'content'],
    'a lot': ['numerous', 'considerable', 'substantial']
  };

  if (tone === 'formal' || tone === 'academic') {
    for (const [weakWord, suggestions] of Object.entries(WEAK_WORDS)) {
      const regex = new RegExp(`\\b${weakWord}\\b`, 'gi');
      let weakMatch: RegExpExecArray | null;
      while ((weakMatch = regex.exec(text)) !== null) {
        rawErrors.push({
          id: `weak-${weakMatch.index}`,
          message: `Weak word choice: "${weakMatch[0]}" can be improved in a ${tone} context.`,
          replacements: suggestions,
          offset: weakMatch.index,
          length: weakMatch[0].length,
          type: 'style'
        });
      }
    }
  }

  // 10. Subject-Verb Agreement
  const svaPatterns = [
    { regex: /\b(he|she|it)\s+(are|were|have)\b/gi, fix: (m: string[]) => m[1] === 'have' ? `${m[0]} has` : `${m[0]} is` },
    { regex: /\b(they|we)\s+(is|was|has)\b/gi, fix: (m: string[]) => m[1] === 'has' ? `${m[0]} have` : `${m[0]} are` },
    { regex: /\b(I)\s+(is|has|are)\b/gi, fix: (m: string[]) => m[1] === 'has' ? 'I have' : 'I am' },
    { regex: /\b(you)\s+(is|was|has)\b/gi, fix: (m: string[]) => m[1] === 'has' ? 'you have' : 'you are' }
  ];

  for (const pattern of svaPatterns) {
    let svaMatch: RegExpExecArray | null;
    while ((svaMatch = pattern.regex.exec(text)) !== null) {
      const matched = svaMatch[0];
      const parts = matched.split(/\s+/);
      const fix = pattern.fix(parts);
      rawErrors.push({
        id: `sva-${svaMatch.index}`,
        message: `Subject-verb agreement: "${matched}" is grammatically incorrect.`,
        replacements: fix ? [fix] : [],
        offset: svaMatch.index,
        length: matched.length,
        type: 'grammar'
      });
    }
  }

  // 11. Readability & Statistics (Flesch-Kincaid)
  if (onProgress) onProgress({ percent: 80, message: "Calculating readability..." });
  
  const sentences = Math.max(1, doc.sentences().length);
  const termsArray = doc.terms().out('array');
  const words = Math.max(1, termsArray.length);
  const characters = text.length;
  
  let totalSyllables = 0;
  termsArray.forEach((t: string) => {
    totalSyllables += Math.max(1, syllable(t));
  });

  const readabilityScore = Math.max(0, Math.min(100, Math.round(
    206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words)
  )));

  const readingTimeMs = Math.round((words / 200) * 60 * 1000);
  const paragraphsTexts = text.split(/\n+/).filter(p => p.trim().length > 0);
  const paragraphsCount = Math.max(1, paragraphsTexts.length);
  const uniqueWordsSet = new Set(termsArray.map((t: string) => t.toLowerCase().trim()).filter(Boolean));
  const uniqueWords = uniqueWordsSet.size;
  const avgSentenceLength = Math.round((words / sentences) * 10) / 10;

  let readabilityGrade = 'Very Hard (Graduate)';
  if (readabilityScore >= 80) readabilityGrade = 'Easy (Grade 5-6)';
  else if (readabilityScore >= 60) readabilityGrade = 'Standard (Grade 7-8)';
  else if (readabilityScore >= 40) readabilityGrade = 'Moderate (Grade 9-12)';
  else if (readabilityScore >= 20) readabilityGrade = 'Difficult (College)';

  // 12. Strict Deduplication & Sorting
  const seenKeys = new Set<string>();
  const finalErrors: GrammarError[] = [];

  // Sort by offset ascending, then length descending
  rawErrors.sort((a, b) => a.offset - b.offset || b.length - a.length);

  for (const err of rawErrors) {
    const errorText = text.substring(err.offset, err.offset + err.length);
    const key = `${err.offset}:${err.length}:${err.type}:${err.message.toLowerCase()}`;
    
    if (!seenKeys.has(key)) {
      seenKeys.add(key);

      // Clean up and deduplicate replacements
      const uniqueReplacements = Array.from(
        new Set(
          (err.replacements || [])
            .map(r => r.trim())
            .filter(r => r.length > 0 && r.toLowerCase() !== errorText.toLowerCase())
        )
      );

      finalErrors.push({
        ...err,
        replacements: uniqueReplacements
      });
    }
  }

  if (onProgress) onProgress({ percent: 100, message: "Done" });

  return {
    errors: finalErrors,
    stats: {
      words,
      characters,
      sentences,
      paragraphs: paragraphsCount,
      readabilityScore,
      readabilityGrade,
      readingTimeMs,
      avgSentenceLength,
      uniqueWords
    }
  };
}
