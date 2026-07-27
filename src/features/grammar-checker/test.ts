import { runGrammarCheck } from './utils/engine';
runGrammarCheck("This is a test message. I has very bad grammr.").then(res => console.log(JSON.stringify(res, null, 2))).catch(console.error);
