import * as fs from "fs";

const readInput = (): number[][] => {
  const contents = fs.readFileSync("inputs/day1Input.txt").toString();

  const numberSegments = contents.split("\n\n");

  return numberSegments.map((numberSegment) =>
    numberSegment.split("\n").map((numAsStr) => Number(numAsStr))
  );
};

const sum = (nums: number[]) => nums.reduce((total, num) => total + num);

export const answer = (): number => {
  const caloriesOfFoodItemsCarriedByEachElf = readInput();

  const totalCaloriesCarriedByEachElf =
    caloriesOfFoodItemsCarriedByEachElf.reduce(
      (acc, cur) => [...acc, sum(cur)],
      []
    );

  const totalCaloriesCarriedByEachElfSorted = [
    ...totalCaloriesCarriedByEachElf,
  ].sort();

  const top3TotalCaloriesCounts = totalCaloriesCarriedByEachElfSorted.slice(
    totalCaloriesCarriedByEachElfSorted.length - 3,
    totalCaloriesCarriedByEachElfSorted.length
  );

  const top3TotalCaloriesCountsSummed = sum(top3TotalCaloriesCounts);

  return top3TotalCaloriesCountsSummed;
};
