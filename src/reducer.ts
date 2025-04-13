import { getRandom, scrambleWord, wordsMatch } from "./util";

type WordPack = readonly string[];
type State = Readonly<
  | {
      phase: "pre-game";
      wordpack: WordPack | null;
      bannedWords: WordPack | null;
    }
  | {
      phase: "in-game";
      goal: string;
      scrambled: string;
      guess: string;
      score: number;
      revealedLetters: number;
      wordpack: WordPack;
      bannedWords: WordPack;
    }
  | {
      phase: "post-game";
      score: number;
      wordpack: WordPack;
      bannedWords: WordPack;
    }
>;

type Action =
  | {
      type: "start-game";
    }
  | {
      type: "update-guess";
      newGuess: string;
    }
  | {
      type: "load-wordpack";
      wordpack: WordPack;
    }
  | {
      type: "load-bannedwords";
      wordpack: WordPack;
    }
  | {
      type: "end-game";
    }
  | {
      type: "get-hint";
    };

type InGameState = Extract<State, { phase: "in-game" }>;

function getInitialState(): State {
  return {
    phase: "pre-game",
    wordpack: null,
    bannedWords: null,
  };
}

function newWordState(state: State): InGameState {
  const newWord: string = getRandom(state.wordpack ?? ["Word"]);
  return {
    phase: "in-game",
    goal: newWord,
    guess: "",
    scrambled: scrambleWord(newWord),
    score: 0,
    revealedLetters: 0,
    wordpack: state.wordpack ?? [],
    bannedWords: state.bannedWords ?? [],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start-game": {
      if (state.phase === "in-game") {
        return state;
      }
      if (state.wordpack === null) {
        return state;
      }
      if (state.bannedWords === null) {
        return state;
      }
      return newWordState(state);
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      const newGuess = action.newGuess.slice(0, state.revealedLetters);
      const revealedLetters = state.goal.slice(0, state.revealedLetters);
      if (!wordsMatch(newGuess, revealedLetters)) {
        // If user removes hinted letters, ignore
        return state;
      }
      if (wordsMatch(action.newGuess, state.goal)) {
        return {
          ...newWordState(state),
          score: state.score + 1,
        };
      }
      return {
        ...state,
        guess: action.newGuess,
      };
    }

    case "load-wordpack": {
      return {
        ...state,
        wordpack: action.wordpack,
      };
    }

    case "load-bannedwords": {
      return {
        ...state,
        bannedWords: action.wordpack,
      };
    }

    case "end-game": {
      if (state.phase !== "in-game") {
        return state;
      }
      return {
        phase: "post-game",
        score: state.score,
        wordpack: state.wordpack,
        bannedWords: state.bannedWords,
      };
    }

    case "get-hint": {
      if (state.phase !== "in-game") {
        return state;
      }
      if (state.revealedLetters + 1 === state.goal.length) {
        return {
          ...newWordState(state),
          score: state.score,
        };
      }
      return {
        ...state,
        revealedLetters: state.revealedLetters + 1,
        scrambled:
          state.goal.slice(0, state.revealedLetters + 1) +
          scrambleWord(state.goal.slice(state.revealedLetters + 1)),
        guess: state.goal.slice(0, state.revealedLetters + 1),
      };
    }
  }
  return state;
}

export { reducer, getInitialState };
export type { WordPack, Action, State, InGameState };
