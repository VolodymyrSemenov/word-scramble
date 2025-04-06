type WordPack = readonly string[];
type State = Readonly<
  | {
      phase: "pre-game";
      wordpack: WordPack | null;
    }
  | {
      phase: "in-game";
      goal: string;
      scrambled: string;
      guess: string;
      score: number;
      wordpack: WordPack;
    }
  | {
      phase: "post-game";
      score: number;
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
    }
  | {
      type: "end-game";
    };

export type { WordPack, Action, State };
