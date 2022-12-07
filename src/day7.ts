import * as fs from "fs";

type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  parent: Directory | null;
  files: File[];
  subDirectories: Directory[];
};

const TOTAL_FILE_SYSTEM_CAPACITY = 70000000;
const SPACE_NEEDED_FOR_UPDATE = 30000000;

const isCommand = (terminalLine: string) => terminalLine.startsWith("$");

const isCdCommand = (terminalLine: string) => terminalLine.includes("cd");

const getDestinationForCdCommand = (cdCommand: string) =>
  cdCommand.split(" ")[2];

const readInput = (): Directory => {
  const contents = fs
    .readFileSync("inputs/day7Input.txt")
    .toString()
    .trim()
    .split("\n");

  const contentsWithoutCdRoot = contents.slice(1, contents.length);

  let currentDirectory: Directory = {
    name: "/",
    parent: null,
    files: [],
    subDirectories: [],
  };

  const rootDir = currentDirectory;

  for (const terminalLine of contentsWithoutCdRoot) {
    if (isCommand(terminalLine)) {
      if (isCdCommand(terminalLine)) {
        const destination = getDestinationForCdCommand(terminalLine);

        if (destination === "..") {
          currentDirectory = currentDirectory.parent as Directory;
        } else {
          currentDirectory = currentDirectory.subDirectories.find(
            (subDirectory) => subDirectory.name === destination
          ) as Directory;
        }
      }
    } else {
      const lsLine = terminalLine.split(" ");

      if (lsLine[0] === "dir") {
        currentDirectory.subDirectories.push({
          name: lsLine[1],
          parent: currentDirectory,
          files: [],
          subDirectories: [],
        });
      } else {
        currentDirectory.files.push({
          name: lsLine[1],
          size: Number(lsLine[0]),
        });
      }
    }
  }

  return rootDir;
};

const sum = (nums: number[]) => nums.reduce((total, num) => total + num, 0);

const directorySize = (dir: Directory): number =>
  sum(dir.files.map((file) => file.size)) +
  sum(dir.subDirectories.map((subDir) => directorySize(subDir)));

const findAllDirectorySizes = (currentDir: Directory): number[] => {
  const result = [];

  const curDirSize = directorySize(currentDir);

  result.push(curDirSize);

  const subDirSizes = currentDir.subDirectories.map((subDir) =>
    findAllDirectorySizes(subDir)
  );

  subDirSizes.forEach((size) => result.push(size));

  return result.flat();
};

const findSmallestFileBigEnoughForTheUpdate = (
  nums: number[],
  spaceNeededToMake: number
) =>
  nums.reduce((acc, cur) => {
    if (
      cur - spaceNeededToMake > 0 &&
      cur - spaceNeededToMake < acc - spaceNeededToMake
    ) {
      return cur;
    }

    return acc;
  }, nums[0]);

export const answer = (): number => {
  const rootDir = readInput();

  const directorySizes = findAllDirectorySizes(rootDir);

  const spaceNeededToInstallTheUpdate =
    directorySize(rootDir) +
    SPACE_NEEDED_FOR_UPDATE -
    TOTAL_FILE_SYSTEM_CAPACITY;

  return findSmallestFileBigEnoughForTheUpdate(
    directorySizes,
    spaceNeededToInstallTheUpdate
  );
};
