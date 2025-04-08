import { State, Action, WordPack, InGameState } from "./types";
import { getRandom, scrambleWord, wordsMatch } from "./util";

function getInitialState(): State {
  return {
    phase: "pre-game",
    wordpack: null,
  };
}

function newWordState(wordpack: WordPack): InGameState {
  const newWord: string = getRandom(wordpack);
  return {
    phase: "in-game",
    goal: newWord,
    guess: "",
    scrambled: scrambleWord(newWord),
    score: 0,
    revealed_letters: 0,
    wordpack: wordpack,
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
      return newWordState(state.wordpack);
    }

    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }

      const newGuess = action.newGuess.slice(0, state.revealed_letters);
      const revealed_letters = state.goal.slice(0, state.revealed_letters);
      if (!wordsMatch(newGuess, revealed_letters)) {
        // If user removes hinted letters, ignore
        return state;
      }
      if (wordsMatch(action.newGuess, state.goal)) {
        return {
          ...newWordState(state.wordpack),
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

    case "end-game": {
      if (state.phase !== "in-game") {
        return state;
      }
      return {
        phase: "post-game",
        score: state.score,
        wordpack: state.wordpack,
      };
    }

    case "get-hint": {
      if (state.phase !== "in-game") {
        return state;
      }
      if (state.revealed_letters + 1 === state.goal.length) {
        return {
          ...newWordState(state.wordpack),
          score: state.score,
        };
      }
      return {
        ...state,
        revealed_letters: state.revealed_letters + 1,
        scrambled:
          state.goal.slice(0, state.revealed_letters + 1) +
          scrambleWord(state.goal.slice(state.revealed_letters + 1)),
        guess: state.goal.slice(0, state.revealed_letters + 1),
      };
    }
  }
  return state;
}

export { reducer, getInitialState };
