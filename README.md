# Neuroevolution in Typescript

&nbsp;&nbsp;

[![Run Test](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml/badge.svg)](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml)
[![Run Test](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml/badge.svg?event=issues)](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml)
[![Run Test](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml/badge.svg?event=release)](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml)
[![Run Test](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml/badge.svg?event=pull_request)](https://github.com/jxmked/ts-neuroevolution/actions/workflows/test.yaml)
![npm](https://img.shields.io/npm/dm/ts-neuroevolution?style=flat-square)


## Neuroevolution

Neuroevolution, or neuro-evolution, is a form of machine learning that uses evolutionary algorithms to train artificial neural networks.

It is most commonly applied in artificial life, computer games, and evolutionary robotics. 
A main benefit is that neuroevolution can be applied more widely than supervised learning algorithms, which require a syllabus of correct input-output pairs.
In contrast, neuroevolution requires only a measure of a network's performance at a task. For example, the outcome of a game 
(i.e. whether one player won or lost) can be easily measured without providing labeled examples of desired strategies.

## Originals

Ts-Neuroevolution is a TypeScript library version of [xviniette](https://github.com/xviniette/FlappyLearning) Neuroevolution.

## Installation

CDN: 

```html
<script src="https://unpkg.com/ts-neuroevolution/dist/neuroevolution.js"></script>
```

NPM: 

```sh
npm install --save ts-neuroevolution
```

## Configuration

```ts
export interface INeuroevolutionConfig {
  /**
   * Network structure
   * 
   * @default - [1, [2], 1]
   * @var number[] - [input, hidden, output]
   */
  network?: (number | number[])[];

  /**
   * Population by generation
   * 
   * @default - 50
   * @var number
   */
  population?: number;

  /**
   * Best network kepts unchange for next generation
   * 
   * @default - 0.2
   * @var number - 0.0 - 1.0
   */
  elitism?: number;

  /**
   * Mix trained networks with randomized networks for next generation
   * 
   * @default - 0.2
   * @var number - 0.0 - 1.0
   */
  randomBehaviour?: number;

  /**
   * Perform mutation on some genomes during breed
   * 
   * @default - 0.1
   * @var number - 0.0 - 1.0
   */
  mutationRate?: number;

  /**
   * Number of generation to be saved. 
   * Set to -1 to only keep the latest generation
   * 
   * @default - 0
   * @var number - -1 - n
   */
  historic?: number; // Latest generations saved.

  /**
   * ...
   * 
   * @default - false
   * @var boolean
   */
  lowHistoric?: boolean;

  /**
   * Sort the best score. AI will rely on best networks
   * -1 = descending. The highest the better
   * 1 = ascending. The lowest the better
   * 
   * @default - -1
   * @var number - -1, 1
   */
  scoreSort?: number;

  /**
   * Number of child to produce during breed
   * 
   * @default - 1
   * @var number
   */
  nbChild?: number;

  /**
   * Probability of making an absolute copy of a genomes during breed
   * 
   * @default - 0.5
   * @var number - 0.0 - 1.0
   */
  crossoverFactor?: number;
}
```

## Recommended and Required Configurations
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES6", // Recomended. ES Module or Higher
    "module": "ES6", // Recomended. ES Module or Higher
    "moduleResolution": "node", // Optional
    "typeRoots": [
      "./node_modules"
    ],

    // Optionals
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Usage

```ts
import { Neuroevolution } from 'neuroevolution-typescript';

const config = {
    ...
}

// Create an instance 
const instance: Neuroevolution = new Neuroevolution(config);

// Generate new generation
// Will return an array of generation
// The array length is based on population
const generations = instance.nextGeneration();


const input = [0,1,1];
const expected = 1;

// Do compute

for(let i = 0; i < instance.options.population; i++) {
// Will return a prediction number ranging 0 to 1
    let result = generations[i].compute(input);
    
    // Tell if is right or wrong
    instance.networkScore(generations[i], Math.ceil(result[0]) === expected);
}

// Optional
// Repeat the process from generating generations

```

***Exporting and Importing***

```ts
// Must have atleast 1 generation completed before exporting trained data

// Your trained data including the configurations
// Will export the last generation
const data = instance.exportData();

const otherNeuvol = new Neuroevolution();

// Import pretrained data


// Note: Configuration from exported data will be use

// Import first before calling
// Neuroevolution.nextGeneration() function otherwise will not work correctly
otherNeuvol.importData(data);


otherNeuvol = instance.nextGeneration();

```

## Examples

[FlappyLearning](https://github.com/jxmked/FlappyLearning) - 
An Implementation of Ts-Neuroevolution with Webpack.

> Tip: You can also use xviniette FlappyLearning version and
> replace the Neuroevolution with this ts-neuroevolution CDN version

## Resources

[Deep Neuroevolution: Genetic Algorithms are a Competitive Alternative for
Training Deep Neural Networks for Reinforcement Learning](https://arxiv.org/pdf/1712.06567.pdf)  

## Scripts

__Start development mode__

`npm start`, `npm run dev`

__Serve Ouput/dist folder__

`npm run serve`

Will serve [http://localhost:8080](http://localhost:8080)

__Linting__

`npm run lint` - Run lint

`npm run lint:fix` - Run lint and fix lines that linter can fix

__Test__

You can directly run `npm test` without `npm run build:test`

since `jest` will automatically compile `Typescript` to `JavaScript` 

__Builds__

- `npm run build` - Build all (except declarations and testing kit)
- `npm run build:umd` - Build Browser Version. Output file 'neuroevolution.js'
- `npm run build:node` - Build ES Node Module Version. Output file 'main.js'
- `npm run build:tsc` - Build Declaration Files. Required for ES Node Modules

__Building for NPM package steps__

- `npm ci`
- `npm run build` - Build both umd and node version
- `npm run bud:tsc` - Build TyoeScript types

__Formating__

`npm run prettier-format` - Start formating code from `./src` and `./tests` using `Prettier`

## License

Under MIT License
