import { isEqual, cloneDeep } from 'lodash';
import { Neuroevolution } from '../src/index';
import Network from '../src/network/network';

const options = {
  network: [3, [2], 1],
  population: 50,
  elitism: 0.2,
  randomBehaviour: 0.2,
  mutationRate: 0.1,
  mutationRange: 0.5,
  historic: 0,
  lowHistoric: false,
  scoreSort: -1,
  nbChild: 1,
  crossoverFactor: 0.5
};

let Neuvol: Neuroevolution;
let generations: Network[] = [];

const trainingSet = [
  {
    input: [1, 1, 1],
    expected: 0
  },
  {
    input: [1, 1, 0],
    expected: 1
  },
  {
    input: [1, 0, 1],
    expected: 1
  },
  {
    input: [1, 0, 0],
    expected: 0
  },
  {
    input: [0, 1, 1],
    expected: 1
  },
  {
    input: [0, 1, 0],
    expected: 0
  },
  {
    input: [0, 0, 1],
    expected: 0
  },
  {
    input: [0, 0, 0],
    expected: 0
  }
];

test('Does Initiate', () => {
  expect(Neuvol).toBeUndefined();
  Neuvol = new Neuroevolution(options);
  expect(Neuvol).not.toBeUndefined();
});

test('Can return configurations', () => {
  expect(isEqual(options, Neuvol.options)).toBeTruthy();
});

test('Can modify configurations', () => {
  const clonedOptions = cloneDeep(options);

  clonedOptions.elitism = 0.5;
  clonedOptions.randomBehaviour = 0.5;

  Neuvol.setConfiguration(clonedOptions);

  expect(isEqual(clonedOptions, Neuvol.options)).toBeTruthy();
});

test('Can initiate generations', () => {
  const gen = Neuvol.nextGeneration();

  expect(gen.length).not.toBe(0);

  generations = gen;
});

test('Can solve atleast 50%', () => {
  let errorRate = 100;

  while (errorRate > 50) {
    for (const gen of generations) {
      let winrate = 0;

      for (const sampleSet of trainingSet) {
        const result = Math.round(gen.compute(sampleSet.input)[0]);

        if (result === sampleSet.expected) {
          winrate++;
        }
      }
      errorRate = (winrate / trainingSet.length) * 100;
      Neuvol.networkScore(gen, 100 - errorRate);
    }

    generations = Neuvol.nextGeneration();
  }

  expect(errorRate).toBeLessThanOrEqual(50);

  // I found that test suit run async so

  //});

  //test('Can do export and import data', () => {

  // Export
  const exportedData = Neuvol.exportData();

  // Create New Neuroevolution Instance
  const feededNeuvol = new Neuroevolution(options);
  let feededGenerations: Network[] = [];

  // Import
  Neuvol.importData(exportedData);

  // Test
  const target = 30;

  // Check if we can hit this
  while (errorRate > target) {
    feededGenerations = feededNeuvol.nextGeneration();

    for (const gen of feededGenerations) {
      let winrate = 0;

      for (const sampleSet of trainingSet) {
        const result = Math.round(gen.compute(sampleSet.input)[0]);

        if (result === sampleSet.expected) {
          winrate++;
        }
      }
      errorRate = (winrate / trainingSet.length) * 100;
      feededNeuvol.networkScore(gen, 100 - errorRate);
    }
  }

  expect(errorRate).toBeLessThanOrEqual(target);
});
