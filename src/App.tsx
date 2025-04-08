import "./App.css";
import React, { useReducer, useEffect } from "react";
import { reducer, getInitialState } from "./reducer";

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  useEffect(() => {
    fetch("./wordle_answers.txt")
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
        <button onClick={() => dispatch({ type: "start-game" })} autoFocus>
          Begin new game
        </button>
      );
      break;
    }

    case "in-game": {
      content = (
        <>
          <div>
            Scrambled Word: {state.goal.slice(0, state.revealed_letters)}{" "}
            {state.scrambled.slice(state.revealed_letters)}
          </div>
          <label>
            Guess:
            <input
              type="text"
              value={state.guess}
              onChange={(ev) =>
                dispatch({ type: "update-guess", newGuess: ev.target.value })
              }
              className="Textbox"
              autoFocus
            />
          </label>
          <button onClick={() => dispatch({ type: "get-hint" })}>
            Get Hint
          </button>
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
          <button onClick={() => dispatch({ type: "start-game" })} autoFocus>
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
