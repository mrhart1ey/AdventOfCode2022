import * as fs from "fs";

type Move = "ROCK" | "PAPER" | "SCISSORS";

type Result = "WIN" | "LOSS" | "DRAW";

type Game = {
  opponentsMove: Move;
  result: Result;
};

const LOSS_POINTS = 0;
const DRAW_POINTS = 3;
const WIN_POINTS = 6;

const readInput = (): Game[] => {
  const contents = fs.readFileSync("inputs/day2Input.txt").toString().trim();

  const lines = contents.split("\n");

  return lines.map((line) => {
    const [opponentsMove, gameResult] = line.split(" ");

    return {
      opponentsMove: inputOpponentMoveSymbolToMove(opponentsMove),
      result: inputGameResult(gameResult),
    };
  });
};

const inputOpponentMoveSymbolToMove = (symbol: string): Move => {
  switch (symbol) {
    case "A":
      return "ROCK";
    case "B":
      return "PAPER";
    case "C":
      return "SCISSORS";
  }

  throw new Error(`Unknown move: ${symbol}`);
};

const inputGameResult = (symbol: string): Result => {
  switch (symbol) {
    case "X":
      return "LOSS";
    case "Y":
      return "DRAW";
    case "Z":
      return "WIN";
  }

  throw new Error(`Unknown game result: ${symbol}`);
};

const sum = (nums: number[]) => nums.reduce((total, num) => total + num);

const scoreForMove = (move: Move): number => {
  switch (move) {
    case "ROCK":
      return 1;
    case "PAPER":
      return 2;
    case "SCISSORS":
      return 3;
  }
};

const scoreForMyMove = (game: Game) => {
  const myMove = findMyMove(game);

  return scoreForMove(myMove);
};

const findMyMove = (game: Game): Move => {
  if (game.result === "WIN") {
    if (game.opponentsMove === "PAPER") {
      return "SCISSORS";
    } else if (game.opponentsMove === "ROCK") {
      return "PAPER";
    }

    return "ROCK";
  } else if (game.result === "LOSS") {
    if (game.opponentsMove === "PAPER") {
      return "ROCK";
    } else if (game.opponentsMove === "ROCK") {
      return "SCISSORS";
    }

    return "PAPER";
  }

  // We picked the same, so draw
  return game.opponentsMove;
};

const scoreForGameResult = (result: Result): number => {
  switch (result) {
    case "WIN":
      return WIN_POINTS;
    case "DRAW":
      return DRAW_POINTS;
    case "LOSS":
      return LOSS_POINTS;
  }
};

const calculateScoresForEachGame = (games: Game[]) =>
  games.map((game) => scoreForGameResult(game.result) + scoreForMyMove(game));

export const answer = (): number => {
  const games = readInput();

  const scoresForGames = calculateScoresForEachGame(games);

  return sum(scoresForGames);
};
