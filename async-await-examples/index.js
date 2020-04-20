const { taskOne, taskTwo } = require('./task');
async function secuentialMain() {
  try {
    //Secuential code
    console.time('Measuring time');
    const valueOne = await taskOne();
    const valueTwo = await taskTwo();
    console.timeEnd('Measuring time');

    console.log(valueOne);
    console.log(valueTwo);
  } catch (error) {
    console.log(error);
  }
}
async function paralelllMain() {
  try {
    //Secuential code
    console.time('Measuring time');
    await Promise.all([null, taskTwo(), taskOne()]).then((results) => {
      console.timeEnd('Measuring time');
      console.log(results[1]);
      console.log(results[2]);
    });
  } catch (error) {
    console.log(error);
  }
}
//secuentialMain();
paralelllMain();
