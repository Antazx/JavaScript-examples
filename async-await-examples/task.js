const util = require('util');
const sleep = util.promisify(setTimeout);

module.exports = {
  async taskOne() {
    try {
      //throw new Error('Some problem');
      await sleep(3000);
      return Promise.resolve('First task complete');
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  async taskTwo() {
    try {
      await sleep(2000);
      return Promise.resolve('Second task complete');
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
};
