import "./App.css";
import React, { useReducer, useEffect } from "react";
import { reducer, getInitialState } from "./reducer";
import { pluralize, cleanString, processWordpack } from "./util";

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const guessInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/wordle_answers.txt")
      .then((response) => response.text())
      .then((text) => {
        dispatch({
          type: "load-wordpack",
          wordpack: processWordpack(text),
        });
      });
  }, []);

  useEffect(() => {
    fetch("https://unpkg.com/naughty-words@1.2.0/en.json")
      .then((response) => response.json())
      .then((array) => {
        dispatch({
          type: "load-bannedwords",
          wordpack: array.map((word: string) => cleanString(word)),
        });
      });
  }, []);

  let content = null;
  switch (state.phase) {
    case "pre-game": {
      if (state.wordpack === null || state.bannedWords === null) {
        content = <div>Loading Resources...</div>;
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
              {state.goal.slice(0, state.revealedLetters)}
            </span>
            {state.scrambled.slice(state.revealedLetters)}
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
          <div>
            Nice game! You guessed {pluralize(state.score, "word")} right!
          </div>
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
