export interface CifrasStep {
  a: number;
  op: '+' | '-' | '×' | '÷';
  b: number;
  res: number;
}

export interface CifrasSolveResult {
  exact: boolean;
  target: number;
  bestValue: number;
  difference: number;
  steps: CifrasStep[];
}

/**
 * Solves Countdown / Cifras numbers game using recursive search.
 */
export function solveCifras(numbers: number[], target: number): CifrasSolveResult {
  let bestValue = numbers[0];
  let minDiff = Math.abs(target - numbers[0]);
  let bestSteps: CifrasStep[] = [];

  function search(currentNumbers: number[], currentSteps: CifrasStep[]) {
    // Check if any current number is closer to target
    for (const num of currentNumbers) {
      const diff = Math.abs(target - num);
      if (diff < minDiff) {
        minDiff = diff;
        bestValue = num;
        bestSteps = [...currentSteps];
        if (minDiff === 0) return true; // Found exact match
      }
    }

    if (currentNumbers.length <= 1) return false;

    // Try all pairs of numbers
    for (let i = 0; i < currentNumbers.length; i++) {
      for (let j = i + 1; j < currentNumbers.length; j++) {
        const a = currentNumbers[i];
        const b = currentNumbers[j];

        const remaining = currentNumbers.filter((_, idx) => idx !== i && idx !== j);

        // Try operations
        const ops: { op: '+' | '-' | '×' | '÷'; res: number; a: number; b: number }[] = [];

        // Addition: a + b
        ops.push({ op: '+', res: a + b, a, b });

        // Subtraction: larger - smaller
        if (a > b) ops.push({ op: '-', res: a - b, a, b });
        else if (b > a) ops.push({ op: '-', res: b - a, a: b, b: a });

        // Multiplication: a * b (exclude multiplying by 1 to prune trivial steps)
        if (a > 1 && b > 1) {
          ops.push({ op: '×', res: a * b, a, b });
        }

        // Division: larger / smaller if integer and divisor > 1
        if (b > 1 && a % b === 0) {
          ops.push({ op: '÷', res: a / b, a, b });
        } else if (a > 1 && b % a === 0) {
          ops.push({ op: '÷', res: b / a, a: b, b: a });
        }

        for (const opItem of ops) {
          const nextSteps = [...currentSteps, { a: opItem.a, op: opItem.op, b: opItem.b, res: opItem.res }];
          const nextNums = [...remaining, opItem.res];

          if (opItem.res === target) {
            bestValue = target;
            minDiff = 0;
            bestSteps = nextSteps;
            return true;
          }

          if (search(nextNums, nextSteps)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  search(numbers, []);

  return {
    exact: minDiff === 0,
    target,
    bestValue,
    difference: minDiff,
    steps: bestSteps,
  };
}

/**
 * Standard Cifras pool of tiles
 */
export const CIFRAS_STANDARD_TILES = [
  // Small numbers (each repeated twice in standard deck)
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
  // Big numbers
  25, 50, 75, 100,
];

export function getRandomCifrasGame(): { target: number; numbers: number[] } {
  // Pick target between 101 and 999
  const target = Math.floor(Math.random() * 899) + 101;

  // Pick numbers: Usually 1 or 2 big numbers and 4 or 5 small numbers
  const bigNumbers = [25, 50, 75, 100];
  const smallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const shuffledBig = [...bigNumbers].sort(() => 0.5 - Math.random());
  const shuffledSmall = [...smallNumbers].sort(() => 0.5 - Math.random());

  const numBig = Math.floor(Math.random() * 3) + 1; // 1 to 3 big numbers
  const numSmall = 6 - numBig;

  const chosenNumbers = [
    ...shuffledBig.slice(0, numBig),
    ...shuffledSmall.slice(0, numSmall),
  ].sort((a, b) => b - a);

  return {
    target,
    numbers: chosenNumbers,
  };
}
