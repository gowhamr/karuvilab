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
      stats: { words: 0, characters: 0, sentences: 0, paragraphs: 0, readabilityScore: 0, readabilityGrade: 'Easy (Grade 5-6)', readingTimeMs: 0, avgSentenceLength: 0, uniqueWords: 0 }
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
  const wordRegex = /\b[a-zA-Z']+\b/g;
  let match;
  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    const isCapitalized = /^[A-Z]/.test(word);
    
    if (word.toUpperCase() === word && word.length > 1) continue;
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

  // 2. Passive Voice Detection
  const passive = doc.match('(#Copula|#Auxiliary) #Adverb? #Participle');
  passive.forEach((p: any) => {
    const offsets = p.out('offset');
    if (offsets && offsets.length > 0) {
      const start = offsets[0].offset.start;
      const end = offsets[0].offset.length;
      errors.push({
        id: `passive-${start}`,
        message: "Passive voice detected. Consider rewriting in active voice.",
        replacements: [],
        offset: start,
        length: end,
        type: 'style'
      });
    }
  });

  // 3. Weasel words / Filler words
  const weasels = ['very', 'really', 'just', 'basically', 'actually', 'literally'];
  weasels.forEach(w => {
    const found = doc.match(w);
    found.forEach((f: any) => {
      const offsets = f.out('offset');
      if (offsets && offsets.length > 0) {
        const start = offsets[0].offset.start;
        const end = offsets[0].offset.length;
        errors.push({
          id: `weasel-${start}`,
          message: `"${w}" is a filler word that weakens your sentence.`,
          replacements: [],
          offset: start,
          length: end,
          type: 'style'
        });
      }
    });
  });

  // Tone-specific checks
  if (tone === 'formal' || tone === 'academic') {
    const contractions = doc.match('#Contraction');
    contractions.forEach((c: any) => {
      const offsets = c.out('offset');
      if (offsets && offsets.length > 0) {
        const start = offsets[0].offset.start;
        const end = offsets[0].offset.length;
        errors.push({
          id: `contraction-${start}`,
          message: `Informal contraction used in ${tone} tone.`,
          replacements: [],
          offset: start,
          length: end,
          type: 'style'
        });
      }
    });
    
    if (tone === 'academic') {
      const pronouns = doc.match('(i|me|my|mine|we|us|our)');
      pronouns.forEach((p: any) => {
        const offsets = p.out('offset');
        if (offsets && offsets.length > 0) {
          const start = offsets[0].offset.start;
          const end = offsets[0].offset.length;
          errors.push({
            id: `pronoun-${start}`,
            message: "First-person pronouns are typically avoided in academic writing.",
            replacements: [],
            offset: start,
            length: end,
            type: 'style'
          });
        }
      });
    }
  } else if (tone === 'casual') {
    doc.terms().forEach((t: any) => {
      const word = t.text('normal');
      if (syllable(word) > 4) {
        const offsets = t.out('offset');
        if (offsets && offsets.length > 0) {
          const start = offsets[0].offset.start;
          const end = offsets[0].offset.length;
          errors.push({
            id: `complex-${start}`,
            message: `Very complex word for a casual tone.`,
            replacements: [],
            offset: start,
            length: end,
            type: 'style'
          });
        }
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

  // 5. A / An Article check
  const articles = doc.match('(a|an) #Noun');
  articles.forEach((m: any) => {
    const terms = m.terms().out('array');
    if (terms.length >= 2) {
      const article = terms[0].toLowerCase().trim();
      const noun = terms[1].toLowerCase().trim();
      const isVowelSound = /^[aeiou]/i.test(noun) || /^hour/i.test(noun) || /^honor/i.test(noun);
      const isConsonantSound = /^u[a-z]*e/i.test(noun) || /^uni/i.test(noun) || /^eu/i.test(noun);
      const actuallyVowelSound = isVowelSound && !isConsonantSound;

      const offsets = m.out('offset');
      if (offsets && offsets.length > 0) {
        const start = offsets[0].offset.start;
        const end = offsets[0].offset.length;

        if (article === 'a' && actuallyVowelSound) {
          errors.push({
            id: `article-${start}`,
            message: `Use "an" before a vowel sound.`,
            replacements: [`an ${terms[1]}`],
            offset: start,
            length: end,
            type: 'grammar'
          });
        } else if (article === 'an' && !actuallyVowelSound) {
          errors.push({
            id: `article-${start}`,
            message: `Use "a" before a consonant sound.`,
            replacements: [`a ${terms[1]}`],
            offset: start,
            length: end,
            type: 'grammar'
          });
        }
      }
    }
  });

  // 7. Punctuation Rules
  const doubleSpaceRegex = / {2,}/g;
  let pMatch;
  while ((pMatch = doubleSpaceRegex.exec(text)) !== null) {
    errors.push({
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
    errors.push({
      id: `punct-ms-${pMatch.index}`,
      message: "Missing space after punctuation.",
      replacements: [`${pMatch[1] || ''} ${pMatch[2] || ''}`],
      offset: pMatch.index,
      length: pMatch[0].length,
      type: 'style'
    });
  }

  const multiPunctRegex = /([!?.]){3,}/g;
  while ((pMatch = multiPunctRegex.exec(text)) !== null) {
    errors.push({
      id: `punct-mp-${pMatch.index}`,
      message: "Excessive consecutive punctuation.",
      replacements: [],
      offset: pMatch.index,
      length: pMatch[0].length,
      type: 'style'
    });
  }

  const spaceBeforePunctRegex = / +([.!?,;:])/g;
  while ((pMatch = spaceBeforePunctRegex.exec(text)) !== null) {
    errors.push({
      id: `punct-sp-${pMatch.index}`,
      message: "Space before punctuation.",
      replacements: [pMatch[1] || ''],
      offset: pMatch.index,
      length: pMatch[0].length,
      type: 'style'
    });
  }

  // 8. Sentence Length Analysis
  doc.sentences().forEach((sentence: any) => {
    const wordCount = sentence.terms().length;
    const offsets = sentence.out('offset');
    if (offsets && offsets.length > 0) {
      const start = offsets[0].offset.start;
      const length = offsets[0].offset.length;
      if (wordCount > 40) {
        errors.push({
          id: `slength-40-${start}`,
          message: `Very long sentence (${wordCount} words). Consider breaking it up for clarity.`,
          replacements: [],
          offset: start,
          length: length,
          type: 'readability'
        });
      } else if (wordCount > 25) {
        errors.push({
          id: `slength-25-${start}`,
          message: `Long sentence (${wordCount} words). Consider simplifying.`,
          replacements: [],
          offset: start,
          length: length,
          type: 'readability'
        });
      }
    }
  });

  // 9. Conciseness - Wordy Phrases
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
    'on a daily basis': 'daily',
    'with regard to': 'about',
    'it is important to note that': '',
    'in my opinion': '',
    'the fact that': 'that'
  };

  for (const [phrase, replacement] of Object.entries(WORDY_PHRASES)) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    let wpMatch;
    while ((wpMatch = regex.exec(text)) !== null) {
      errors.push({
        id: `wordy-${wpMatch.index}`,
        message: `Wordy phrase: "${wpMatch[0]}". Consider replacing it.`,
        replacements: replacement === '' ? [] : [replacement],
        offset: wpMatch.index,
        length: wpMatch[0].length,
        type: 'style'
      });
    }
  }

  // 10. Word Choice - Weak Words
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
      const found = doc.match(weakWord);
      found.forEach((f: any) => {
        const offsets = f.out('offset');
        if (offsets && offsets.length > 0) {
          const start = offsets[0].offset.start;
          const end = offsets[0].offset.length;
          errors.push({
            id: `weak-${start}`,
            message: `Weak word choice: "${weakWord}" may not be appropriate in a ${tone} context.`,
            replacements: suggestions,
            offset: start,
            length: end,
            type: 'style'
          });
        }
      });
    }
  }

  // 11. Subject-Verb Agreement
  const svaPatterns = [
    { regex: /\b(he|she|it) (are|were|have)\b/gi },
    { regex: /\b(they|we) (is|was|has)\b/gi },
    { regex: /\b(I) (is|was|has|are)\b/gi },
    { regex: /\b(you) (is|was|has)\b/gi }
  ];

  for (const pattern of svaPatterns) {
    let svaMatch;
    while ((svaMatch = pattern.regex.exec(text)) !== null) {
      errors.push({
        id: `sva-${svaMatch.index}`,
        message: `Subject-verb agreement: "${svaMatch[0]}" may be incorrect.`,
        replacements: [],
        offset: svaMatch.index,
        length: svaMatch[0].length,
        type: 'grammar'
      });
    }
  }

  // 12. Tense Consistency
  const paragraphsTexts = text.split(/\n\n/);
  let currentOffset = 0;
  paragraphsTexts.forEach((paragraph) => {
    const pLength = paragraph.length;
    if (pLength > 0) {
      const pDoc = nlp(paragraph);
      const pastCount = pDoc.match('#PastTense').length;
      const presentCount = pDoc.match('#PresentTense').length;
      
      const totalTenses = pastCount + presentCount;
      if (pastCount >= 3 && presentCount >= 3) {
        const minorityCount = Math.min(pastCount, presentCount);
        if (minorityCount > 0.3 * totalTenses) {
          errors.push({
            id: `tense-${currentOffset}`,
            message: 'Mixed tenses detected in this paragraph. Consider using consistent tense.',
            replacements: [],
            offset: currentOffset,
            length: pLength,
            type: 'readability'
          });
        }
      }
    }
    // +2 for the \n\n, unless it's the last paragraph
    currentOffset += pLength + 2; 
  });

  // 6. Stats & Readability (Flesch-Kincaid)
  if (onProgress) onProgress({ percent: 80, message: "Calculating readability..." });
  
  const sentences = doc.sentences().length || 1;
  const words = doc.terms().length || 1;
  const characters = text.length;
  
  let totalSyllables = 0;
  doc.terms().out('array').forEach((t: string) => {
    totalSyllables += syllable(t);
  });

  const readabilityScore = Math.max(0, Math.min(100, Math.round(
    206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words)
  )));

  const readingTimeMs = Math.round((words / 200) * 60 * 1000);

  const paragraphsCount = Math.max(1, paragraphsTexts.filter(p => p.trim().length > 0).length);
  const uniqueWordsSet = new Set(doc.terms().out('array').map((t: string) => t.toLowerCase().trim()).filter(Boolean));
  const uniqueWords = uniqueWordsSet.size;
  const avgSentenceLength = words / sentences;

  let readabilityGrade = 'Very Hard (Graduate)';
  if (readabilityScore >= 80) readabilityGrade = 'Easy (Grade 5-6)';
  else if (readabilityScore >= 60) readabilityGrade = 'Moderate (Grade 7-8)';
  else if (readabilityScore >= 40) readabilityGrade = 'Moderate (Grade 9-12)';
  else if (readabilityScore >= 20) readabilityGrade = 'Hard (College)';

  if (onProgress) onProgress({ percent: 100, message: "Done" });

  return {
    errors,
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
