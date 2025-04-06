import "./App.css";
import React, { useReducer, useEffect } from "react";
import { getRandom, scrambleWord } from "./util";
import { WordPack, Action, State } from "./types";
import { reducer, getInitialState } from "./reducer";

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
