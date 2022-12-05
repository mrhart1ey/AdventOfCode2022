import * as fs from "fs";

type Move = {
  amount: number;
  fromStack: number;
  toStack: number;
};

type SupplyStacks = {
  stacks: string[][];
  moves: Move[];
};

const constructStack = (stacksStr: string[], indexOfStack: number) => {
  const stack: string[] = [];

  let currentStackSize = 0;
  let crate: string | undefined;

  while ((crate = stacksStr[currentStackSize]?.at(indexOfStack))?.trim()) {
    stack.push(crate);
    currentStackSize++;
  }

  return stack;
};

const findStackIndexs = (numberLine: string) =>
  numberLine.split("").reduce<number[]>((acc, cur, index) => {
    if (cur !== " ") {
      acc.push(index);
    }

    return acc;
  }, []);

const parseCurrentStackState = (currentStackStateStr: string) => {
  const lines = currentStackStateStr.split("\n").reverse();

  const stackIndexs = findStackIndexs(lines[0]);

  const stacksWithoutNumbers = lines.slice(1, lines.length);

  const stacks: string[][] = [];

  for (let i = 0; i < stackIndexs.length; i++) {
    stacks.push(constructStack(stacksWithoutNumbers, stackIndexs[i]));
  }

  return stacks;
};

const parseMovesToMake = (movesStr: string) =>
  movesStr.split("\n").map((moveStr) => {
    const parts = moveStr.split(" ");

    return {
      amount: Number(parts[1]),
      // Make it 0-indexed
      fromStack: Number(parts[3]) - 1,
      toStack: Number(parts[5]) - 1,
    };
  });

const readInput = (): SupplyStacks => {
  const contents = fs.readFileSync("inputs/day5Input.txt").toString().trim();

  const [currentStackStateStr, movesStr] = contents.split("\n\n");

  const currentStackState = parseCurrentStackState(currentStackStateStr);

  const movesToMake = parseMovesToMake(movesStr);

  return {
    stacks: currentStackState,
    moves: movesToMake,
  };
};

const executeMove = (initialStacks: string[][], move: Move) => {
  const stacksToMakeTheMoveOn = initialStacks.map((stack) => [...stack]);

  const stackToTakeFrom = stacksToMakeTheMoveOn[move.fromStack];

  const cratesToMove = stackToTakeFrom.splice(
    stackToTakeFrom.length - move.amount,
    move.amount
  );

  stacksToMakeTheMoveOn[move.toStack] =
    stacksToMakeTheMoveOn[move.toStack].concat(cratesToMove);

  return stacksToMakeTheMoveOn;
};

const executeMoves = (initialStacks: string[][], moves: Move[]) =>
  moves.reduce((acc, cur) => executeMove(acc, cur), initialStacks);

export const answer = (): string => {
  const supplyStacks = readInput();

  const finalStacks = executeMoves(supplyStacks.stacks, supplyStacks.moves);

  const createsOnTopOfEachStack = finalStacks.map(
    (stack) => stack[stack.length - 1]
  );

  return createsOnTopOfEachStack.join("");
};
