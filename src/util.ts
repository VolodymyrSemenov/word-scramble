function getRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scrambleWord(word: string): string {
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
    return scrambleWord(word);
  }
  return combinedWord;
}

function wordsMatch(word1: string, word2: string): boolean {
  return cleanString(word1) === cleanString(word2);
}

function cleanString(word: string): string {
  return word.trim().toUpperCase().replace(/ +/, " ");
}

export { getRandom, scrambleWord, wordsMatch };
