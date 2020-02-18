const { Worker, parentPort, workerData } = require('worker_threads');

// get the numbers
const numbers = workerData;
const calculateFactorial = numArray =>
  numArray.reduce((acc, val) => acc * val, 1n);

const result = calculateFactorial(numbers);
parentPort.postMessage(result);
