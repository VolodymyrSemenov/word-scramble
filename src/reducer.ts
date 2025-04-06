import { State, Action } from "./types";
import { getRandom, scrambleWord } from "./util";

function getInitialState(): State {
  return {
    phase: "pre-game",
    wordpack: null,
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
      const newWord: string = getRandom(state.wordpack);
      return {
        phase: "in-game",
        goal: newWord,
        guess: "",
        scrambled: scrambleWord(newWord),
        wordpack: state.wordpack,
        score: 0,
        letters_revealed: 0
      };
    }
    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }
      if (
        action.newGuess.trim().toUpperCase().replace(/ +/, " ") === state.goal
      ) {
        const newWord: string = getRandom(state.wordpack);
        return {
          ...state,
          goal: newWord,
          guess: "",
          scrambled: scrambleWord(newWord),
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
      return {
        ...state,
        letters_revealed: state.letters_revealed+1
      }
    }
  }
  return state;
}

export { reducer, getInitialState };
