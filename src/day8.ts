import * as fs from "fs";

type Position = {
  i: number;
  j: number;
};

const readInput = (): number[][] => {
  const contents = fs
    .readFileSync("inputs/day8Input.txt")
    .toString()
    .trim()
    .split("\n");

  return contents.map((line) =>
    line.split("").map((treeHeight) => Number(treeHeight))
  );
};

const left = (pos: Position): Position => ({ i: pos.i, j: pos.j - 1 });

const right = (pos: Position): Position => ({ i: pos.i, j: pos.j + 1 });

const up = (pos: Position): Position => ({ i: pos.i - 1, j: pos.j });

const down = (pos: Position): Position => ({ i: pos.i + 1, j: pos.j });

const positionsInDirection = (
  starting: Position,
  direction: (pos: Position) => Position,
  forrestWidth: number,
  forrestHeight: number
): Position[] => {
  const result = [];

  let currentPos = direction(starting);

  while (
    currentPos.i >= 0 &&
    currentPos.i < forrestHeight &&
    currentPos.j >= 0 &&
    currentPos.j < forrestWidth
  ) {
    result.push(currentPos);
    currentPos = direction(currentPos);
  }

  return result;
};

const findVieweingDistance = (
  trees: number[][],
  treePosition: Position,
  direction: (pos: Position) => Position
): number => {
  let count = 0;

  const positionInDirection = positionsInDirection(
    treePosition,
    direction,
    trees[0].length,
    trees.length
  );

  const baseHeight = trees[treePosition.i][treePosition.j];

  for (const position of positionInDirection) {
    count++;

    if (baseHeight <= trees[position.i][position.j]) {
      break;
    }
  }

  return count;
};

const findScenicScoresForTree = (
  trees: number[][],
  treePosition: Position
): number => {
  const upVieweingDistance = findVieweingDistance(trees, treePosition, up);
  const downVieweingDistance = findVieweingDistance(trees, treePosition, down);
  const leftVieweingDistance = findVieweingDistance(trees, treePosition, left);
  const rightVieweingDistance = findVieweingDistance(
    trees,
    treePosition,
    right
  );

  return (
    upVieweingDistance *
    downVieweingDistance *
    leftVieweingDistance *
    rightVieweingDistance
  );
};

const findScenicScoresForEachTree = (trees: number[][]): number[] => {
  const result = [];

  for (let i = 0; i < trees.length; i++) {
    for (let j = 0; j < trees[i].length; j++) {
      result.push(findScenicScoresForTree(trees, { i, j }));
    }
  }

  return result;
};

export const answer = (): number => {
  const trees = readInput();

  const scenicScores = findScenicScoresForEachTree(trees);

  return Math.max(...scenicScores);
};
