import * as fs from "fs";

type AssignmentRange = {
  start: number;
  end: number;
};

type PairSectionAssignment = {
  elf1: AssignmentRange;
  elf2: AssignmentRange;
};

const parseAssignmentRange = (assignmentRangeStr: string): AssignmentRange => {
  const [startStr, endStr] = assignmentRangeStr.split("-");

  return {
    start: Number(startStr),
    end: Number(endStr),
  };
};

const readInput = (): PairSectionAssignment[] => {
  const contents = fs.readFileSync("inputs/day4Input.txt").toString().trim();

  const lines = contents.split("\n");

  return lines.map((line) => {
    const [elf1, elf2] = line.split(",");

    return {
      elf1: parseAssignmentRange(elf1),
      elf2: parseAssignmentRange(elf2),
    };
  });
};

const sum = (nums: number[]) => nums.reduce((total, num) => total + num);

const doesRangeOverlap = (range1: AssignmentRange, range2: AssignmentRange) =>
  range1.start <= range2.end && range1.end >= range2.start;

export const answer = (): number => {
  const pairSectionAssignments = readInput();

  // Numbers instead of booleans so they can be summed easy
  const assignmentsWithOverlappingRanges = pairSectionAssignments.map(
    (pairSectionAssignments) =>
      doesRangeOverlap(pairSectionAssignments.elf1, pairSectionAssignments.elf2)
        ? 1
        : 0
  );

  return sum(assignmentsWithOverlappingRanges);
};
