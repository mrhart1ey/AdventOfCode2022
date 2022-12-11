import * as fs from "fs";

const KNOTS = 10;

type Position = {
  x: number;
  y: number;
};

type Rope = Position[];

type Move = {
  direction: (pos: Position) => Position;
  amountBy: number;
};

const left = (pos: Position): Position => ({ y: pos.y, x: pos.x - 1 });

const right = (pos: Position): Position => ({ y: pos.y, x: pos.x + 1 });

const up = (pos: Position): Position => ({ y: pos.y + 1, x: pos.x });

const down = (pos: Position): Position => ({ y: pos.y - 1, x: pos.x });

const stringigyPosition = (pos: Position): string => `${pos.x},${pos.y}`;

const parseDirection = (
  directionStr: string
): ((pos: Position) => Position) => {
  switch (directionStr) {
    case "L":
      return left;
    case "R":
      return right;
    case "U":
      return up;
    case "D":
      return down;
  }

  throw new Error("Unknown direction");
};

const readInput = (): Move[] => {
  const contents = fs
    .readFileSync("inputs/day9Input.txt")
    .toString()
    .trim()
    .split("\n");

  return contents.map((line) => {
    const components = line.split(" ");

    return {
      direction: parseDirection(components[0]),
      amountBy: Number(components[1]),
    };
  });
};

const findNewKnotPosition = (
  justMovedKnot: Position,
  oldKnot: Position
): Position => {
  if (oldKnot.x + 1 < justMovedKnot.x && oldKnot.y === justMovedKnot.y) {
    return { y: oldKnot.y, x: oldKnot.x + 1 };
  } else if (oldKnot.x - 1 > justMovedKnot.x && oldKnot.y === justMovedKnot.y) {
    return { y: oldKnot.y, x: oldKnot.x - 1 };
  } else if (oldKnot.y - 1 > justMovedKnot.y && oldKnot.x === justMovedKnot.x) {
    return { y: oldKnot.y - 1, x: oldKnot.x };
  } else if (oldKnot.y + 1 < justMovedKnot.y && oldKnot.x === justMovedKnot.x) {
    return { y: oldKnot.y + 1, x: oldKnot.x };
  } else if (
    (oldKnot.x < justMovedKnot.x && oldKnot.y + 1 < justMovedKnot.y) ||
    (oldKnot.x + 1 < justMovedKnot.x && oldKnot.y < justMovedKnot.y)
  ) {
    return { y: oldKnot.y + 1, x: oldKnot.x + 1 };
  } else if (
    (oldKnot.x < justMovedKnot.x && oldKnot.y - 1 > justMovedKnot.y) ||
    (oldKnot.x + 1 < justMovedKnot.x && oldKnot.y > justMovedKnot.y)
  ) {
    return { y: oldKnot.y - 1, x: oldKnot.x + 1 };
  } else if (
    (oldKnot.x > justMovedKnot.x && oldKnot.y + 1 < justMovedKnot.y) ||
    (oldKnot.x - 1 > justMovedKnot.x && oldKnot.y < justMovedKnot.y)
  ) {
    return { y: oldKnot.y + 1, x: oldKnot.x - 1 };
  } else if (
    (oldKnot.x > justMovedKnot.x && oldKnot.y - 1 > justMovedKnot.y) ||
    (oldKnot.x - 1 > justMovedKnot.x && oldKnot.y > justMovedKnot.y)
  ) {
    return { y: oldKnot.y - 1, x: oldKnot.x - 1 };
  }

  // Can stay how it was before
  return oldKnot;
};

const simulateRopeMovement = (moves: Move[], initialRope: Rope): Rope[] => {
  const ropePositions: Rope[] = [];
  let currentRope = initialRope.map((knot) => ({ ...knot }));

  moves.forEach((move) => {
    for (let i = 0; i < move.amountBy; i++) {
      const newRope = currentRope.map((knot) => ({ ...knot }));
      newRope[0] = move.direction(newRope[0]);

      for (let j = 1; j < newRope.length; j++) {
        newRope[j] = findNewKnotPosition(newRope[j - 1], newRope[j]);
      }

      ropePositions.push(newRope);
      currentRope = newRope;
    }
  });

  return ropePositions;
};

const makeInitialRope = (knots: number): Rope =>
  new Array<Position>(knots).fill({ x: 0, y: 0 });

export const answer = (): number => {
  const moves = readInput();

  const initialRope = makeInitialRope(KNOTS);

  const ropes = simulateRopeMovement(moves, initialRope);

  const ropePositionCount = new Set(
    ropes
      .map((rope) =>
        rope
          .slice(rope.length - 1, rope.length)
          .map((knot) => stringigyPosition(knot))
      )
      .flat()
  ).size;

  return ropePositionCount;
};
