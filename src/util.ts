function getRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scrambleWord(word: string): string {
  let ret: string[] = [];
  let letters = Array.from(word);
  letters.forEach((_, idx) => {
    const goodLetters = word.length - idx; // Letters from the front that can be used
    let chosenIdx = Math.floor(Math.random() * goodLetters);

    if (chosenIdx === idx) {
      // Prevents outputting unscrambled word
      chosenIdx = (chosenIdx + 1) % goodLetters;
    }

    ret.push(letters[chosenIdx]);

    // Swap with last goodLetter
    [letters[chosenIdx], letters[goodLetters - 1]] = [
      letters[goodLetters - 1],
      letters[chosenIdx],
    ];
  });
  return ret.join("");
}

function wordsMatch(word1: string, word2: string): boolean {
  const word1Cleaned = word1.trim().toUpperCase().replace(/ +/, " ");
  const word2Cleaned = word2.trim().toUpperCase().replace(/ +/, " ");
  return word1Cleaned === word2Cleaned;
}

export { getRandom, scrambleWord, wordsMatch };
