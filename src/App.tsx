import "./App.css";
import React, { useReducer, useEffect } from "react";

type WordPack = readonly string[];
type State = Readonly<
  | {
      phase: "pre-game";
      wordpack: WordPack | null;
    }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
      wordpack: WordPack;
    }
  | {
      phase: "post-game";
      goal: string;
      wordpack: WordPack;
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
    };

function getInitialState(): State {
  return {
    phase: "pre-game",
    wordpack: null,
  };
}

function getRandomWord(wordpack: WordPack): string {
  return wordpack[Math.floor(Math.random() * wordpack.length)];
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
      return {
        phase: "in-game",
        goal: getRandomWord(state.wordpack),
        guess: "",
        wordpack: state.wordpack,
      };
    }
    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }
      if (action.newGuess === state.goal) {
        return {
          phase: "post-game",
          goal: state.goal,
          wordpack: state.wordpack,
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
        wordpack: action.wordpack
      };
    }
  }
  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  useEffect(() => {
    fetch(
      "word-scramble/wordle_answers.txt"
    )
      .then((response) => response.text())
      .then((text) =>
        dispatch({
          type: "load-wordpack",
          wordpack: text
            .split("\n")
            .map((word) => word.toUpperCase().trim())
            .filter(Boolean),
        }),
      );
  }, []);

  let content = null;
  switch (state.phase) {
    case "pre-game": {
      content = (
        <button onClick={() => dispatch({ type: "start-game" })}>
          Begin new game
        </button>
      );
      break;
    }

    case "in-game": {
      content = (
        <>
          <div>Goal: {state.goal}</div>
          <label>
            Guess:
            <input
              type="text"
              value={state.guess}
              onChange={(ev) =>
                dispatch({ type: "update-guess", newGuess: ev.target.value })
              }
            />
          </label>
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>Nice game! You guessed {state.goal}</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game
          </button>
        </>
      );
      break;
    }
  }
  return (
    <div className="App">
      {content}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
