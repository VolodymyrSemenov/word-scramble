import "./App.css";
import React, { useReducer, useEffect } from "react";
import { getRandom, scrambleWord } from "./util";
import { WordPack, Action, State } from "./types";

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
  }
  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  useEffect(() => {
    fetch("word-scramble/wordle_answers.txt")
      .then((response) => response.text())
      .then((text) => {
        setTimeout(
          () =>
            dispatch({
              type: "load-wordpack",
              wordpack: text
                .split("\n")
                .map((word) => word.toUpperCase().trim())
                .filter(Boolean),
            }),
          3000,
        );
      });
  }, []);

  let content = null;
  switch (state.phase) {
    case "pre-game": {
      if (state.wordpack === null) {
        content = <div>Loading Wordpack...</div>;
        break;
      }
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
          <div>Scrambled Word: {state.scrambled}</div>
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
          <button onClick={() => dispatch({ type: "end-game" })}>
            End Game
          </button>
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>Nice game! You guessed {state.score} words right!</div>
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
