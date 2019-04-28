const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createDirectory = directory => {
  return new Promise((resolve, reject) => {
    rimraf(directory, error => {
      if (error) {
        reject(error);
      }
      mkdirp(directory, error => {
        if (error) {
          reject(error);
        }
        resolve(directory);
      });
    });
  });
};

module.exports = createDirectory;
