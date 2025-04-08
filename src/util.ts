function getRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scrambleWord(word: string): string {
  let ret: string[] = [];
  let availableLetters = Array.from(word);
  Array.from(word).forEach((_, idx) => {
    const chosenIdx = Math.floor(Math.random() * (word.length - idx));
    ret.push(word[chosenIdx]);
    [availableLetters[chosenIdx], availableLetters[word.length - 1]] = [
      availableLetters[word.length - 1],
      availableLetters[chosenIdx],
    ];
  });
  return availableLetters.join("");
}

function wordsMatch(word1: string, word2: string): boolean {
  const word1Cleaned = word1.trim().toUpperCase().replace(/ +/, " ");
  const word2Cleaned = word2.trim().toUpperCase().replace(/ +/, " ");
  return word1Cleaned === word2Cleaned;
}

export { getRandom, scrambleWord, wordsMatch };
