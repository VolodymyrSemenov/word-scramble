import { WordPack, BannedWords } from "./reducer";

function getRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scrambleWord(word: string, bannedWords: BannedWords): string {
  let ret: string[] = [];
  let letters = Array.from(word);
  letters.forEach((_, idx) => {
    const goodLetters = word.length - idx; // Letters from the front that can be used
    let chosenIdx = Math.floor(Math.random() * goodLetters);

    ret.push(letters[chosenIdx]);

    // Swap with last goodLetter
    [letters[chosenIdx], letters[goodLetters - 1]] = [
      letters[goodLetters - 1],
      letters[chosenIdx],
    ];
  });

  const combinedWord = ret.join("");
  if (combinedWord === word && new Set(word).size > 1) {
    return scrambleWord(word, bannedWords);
  }
  if (bannedWords.has(combinedWord)) {
    return scrambleWord(word, bannedWords);
  }
  return combinedWord;
}

function wordsMatch(word1: string, word2: string): boolean {
  return cleanString(word1) === cleanString(word2);
}

function cleanString(word: string): string {
  return word.trim().toUpperCase().replace(/ +/, " ");
}

// Missing irregular nouns ex. child/children
// Missing nouns that are both singular and plural ex. deer, fish
// Missing latin greek ex. stimulus/stimuli
// Monarch shoud be monarch but becomes Monarches. Soft vs hard ch
// f/ef endings can be add s or replace f/ef for ves
function pluralize(num: number, word: string): string {
  if (num === 1) {
    return "1 " + word;
  }
  let pluralized_form = word + "s"; // Base rule add s

  if (word.match(/\w*(?:j|s|sh|x|z|ch)\b/)) {
    // peach/peaches
    pluralized_form = word + "es";
  }
  if (word.match(/\w*[^aeiou]y\b/)) {
    // party/parties
    pluralized_form = word.slice(0, word.length - 1) + "ies";
  }
  if (word.match(/\w*[^aeiou]o\b/)) {
    // potato/potatoes
    pluralized_form = word + "es";
  }

  return `${num} ${pluralized_form}`;
}

function processWordpack(text: String): WordPack {
  return text
    .split("\n")
    .map((word) => cleanString(word))
    .filter(Boolean);
}

export {
  getRandom,
  scrambleWord,
  wordsMatch,
  pluralize,
  cleanString,
  processWordpack,
};
