const os = require('os');
const ora = require('ora');
const path = require('path');
const inquirer = require('inquirer');
const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');

const NS_PER_SEC = 1e9;
const userCPUCount = os.cpus().length;
const workerPath = path.resolve('./factorial-worker.js');

const calculateFactorialWithWorkers = number => {
  if (number === 0) {
    return 1;
  } else {
    return new Promise(async (parentResolve, parentReject) => {
      const numbers = [];
      for (let i = 1n; i < number; i++) {
        numbers.push(i);
      }

      const segmentSize = Math.ceil(numbers.length / userCPUCount);
      const segments = [];

      for (let segmentIndex = 0; segmentIndex < userCPUCount; segmentIndex++) {
        const start = segmentIndex * segmentSize;
        const end = start + segmentSize;
        const segment = numbers.slice(start, end);
        segments.push(segment);
      }

      try {
        const results = await Promise.all(
          segments.map(
            segment =>
              new Promise((resolve, reject) => {
                const worker = new Worker(workerPath, {
                  workerData: segment
                });
                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', code => {
                  if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
                });
              })
          )
        );

        const finalResult = results.reduce((acc, val) => acc * val, 1n);
        parentResolve(finalResult);
      } catch (e) {
        parentReject(e);
      }
    });
  }
};

const calculateFactorial = number => {
  const numbers = [];
  for (let i = 1n; i < number; i++) {
    numbers.push(i);
  }

  return numbers.reduce((acc, val) => acc * val, 1n);
};

const benchmarkFactorial = async (inputNumber, factFun, label) => {
  const spinner = ora(`Calculating with ${label}..`).start();
  const startTime = process.hrtime();
  const result = await factFun(BigInt(inputNumber));
  const diffTime = process.hrtime(startTime);
  spinner.succeed(
    `${label} result done in ${diffTime[0] * NS_PER_SEC + diffTime[1]}`
  );
  return diffTime;
};

const run = async () => {
  const { inputNumber } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputNumber',
      message: 'Calculate factorial for: ',
      default: 5000
    }
  ]);

  const timeWorkers = await benchmarkFactorial(
    inputNumber,
    calculateFactorialWithWorkers,
    'Workers'
  );
  const timeLocal = await benchmarkFactorial(
    inputNumber,
    calculateFactorial,
    'Local'
  );
  console.log(`timeWorkers ${timeWorkers}, timeLocal ${timeLocal}`);
  const totalTime = timeLocal - timeWorkers;
  console.log(`Time diff =  ${Math.floor(totalTime / 1000000000)}`);
};

run();
