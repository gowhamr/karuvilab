/**
 * Readability & Timing Metrics for Markdown documents.
 * Calculates Reading Time, Speaking Time, Sentence Count, Syllables,
 * Flesch Reading Ease, and Flesch-Kincaid Grade Level.
 */

export interface ReadabilityMetrics {
  words: number;
  sentences: number;
  syllables: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  fleschScore: number;
  fleschGrade: string;
  gradeLevel: number;
}

export function countSyllablesInWord(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Syllable counting heuristic
  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < clean.length; i++) {
    const isVowel = vowels.includes(clean[i] || '');
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  // Adjust for silent 'e' at end
  if (clean.endsWith('e') && !clean.endsWith('le') && count > 1) {
    count--;
  }

  return Math.max(1, count);
}

export function calculateReadability(text: string): ReadabilityMetrics {
  if (!text || typeof text !== 'string') {
    return {
      words: 0,
      sentences: 0,
      syllables: 0,
      readingTimeMin: 0,
      speakingTimeMin: 0,
      fleschScore: 100,
      fleschGrade: 'Very Easy',
      gradeLevel: 5,
    };
  }

  // Remove code blocks, HTML tags, and markdown formatting for accurate prose analysis
  const prose = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_\-~>|]/g, ' ')
    .trim();

  // Words
  const wordTokens = prose.split(/\s+/).filter(w => /[a-zA-Z0-9]/.test(w));
  const words = wordTokens.length;

  if (words === 0) {
    return {
      words: 0,
      sentences: 0,
      syllables: 0,
      readingTimeMin: 0,
      speakingTimeMin: 0,
      fleschScore: 100,
      fleschGrade: 'Very Easy',
      gradeLevel: 5,
    };
  }

  // Sentences
  const sentenceMatches = prose.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
  const sentences = Math.max(1, sentenceMatches.length);

  // Total Syllables
  let syllables = 0;
  for (const w of wordTokens) {
    syllables += countSyllablesInWord(w);
  }

  const asl = words / sentences; // Average Sentence Length
  const asw = syllables / words; // Average Syllables per Word

  // Flesch Reading Ease: 206.835 - 1.015(ASL) - 84.6(ASW)
  const rawFlesch = 206.835 - 1.015 * asl - 84.6 * asw;
  const fleschScore = Math.max(0, Math.min(100, Math.round(rawFlesch * 10) / 10));

  // Flesch-Kincaid Grade Level: 0.39(ASL) + 11.8(ASW) - 15.59
  const rawGrade = 0.39 * asl + 11.8 * asw - 15.59;
  const gradeLevel = Math.max(1, Math.min(18, Math.round(rawGrade * 10) / 10));

  // Qualitative grade description
  let fleschGrade = 'Standard (8th–9th Grade)';
  if (fleschScore >= 90) fleschGrade = 'Very Easy (5th Grade)';
  else if (fleschScore >= 80) fleschGrade = 'Easy (6th Grade)';
  else if (fleschScore >= 70) fleschGrade = 'Fairly Easy (7th Grade)';
  else if (fleschScore >= 60) fleschGrade = 'Standard (8th–9th Grade)';
  else if (fleschScore >= 50) fleschGrade = 'Fairly Difficult (10th–12th Grade)';
  else if (fleschScore >= 30) fleschGrade = 'Difficult (College)';
  else fleschGrade = 'Very Confusing (Graduate)';

  // Reading & Speaking Time
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));
  const speakingTimeMin = Math.max(1, Math.ceil(words / 130));

  return {
    words,
    sentences,
    syllables,
    readingTimeMin,
    speakingTimeMin,
    fleschScore,
    fleschGrade,
    gradeLevel,
  };
}
