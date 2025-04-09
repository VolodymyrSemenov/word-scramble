import "./App.css";
import React, { useReducer, useEffect } from "react";
import { reducer, getInitialState } from "./reducer";
import {pluralize} from "./util"

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const guessInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/wordle_answers.txt")
      .then((response) => response.text())
      .then((text) => {
        dispatch({
          type: "load-wordpack",
          wordpack: text
            .split("\n")
            .map((word) => word.toUpperCase().trim())
            .filter(Boolean),
        });
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
            Scrambled Word:{" "}
            <span className="GuessedText">
              {state.goal.slice(0, state.revealed_letters)}
            </span>
            {state.scrambled.slice(state.revealed_letters)}
          </div>
          <label>
            Guess:
            <input
              type="text"
              value={state.guess}
              ref={guessInputRef}
              onChange={(ev) =>
                dispatch({ type: "update-guess", newGuess: ev.target.value })
              }
              className="Textbox"
              autoFocus
            />
          </label>
          <button
            onClick={() => {
              dispatch({ type: "get-hint" });
              guessInputRef.current?.focus();
            }}
            className="Green"
          >
            Get Hint
          </button>
          <button
            className="Red"
            onClick={() => dispatch({ type: "end-game" })}
          >
            End Game
          </button>
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>Nice game! You guessed {pluralize(state.score, "word")} right!</div>
          <button onClick={() => dispatch({ type: "start-game" })} autoFocus>
            Begin new game
          </button>
        </>
      );
      break;
    }
  }
  return <div className="App">{content}</div>;
}

export default App;
