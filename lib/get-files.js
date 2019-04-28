const fs = require('fs');
const path = require('path');
const yaml = require('yaml-front-matter');
const marked = require('marked');

const getFile = basePath => file => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, file), 'utf8', function(error, fileContent) {
      if (error) {
        reject(error);
      }

      const result = yaml.loadFront(fileContent);
      const id = path.parse(file).name;
      const content  = result.__content.trim();

      marked(
        content,
        { sanitize: false },
        (error, __content) => {
          resolve({ ...result, __content, file, id });
        },
      );
    });
  });
};

module.exports = async basePath => {
  return new Promise((resolve, reject) => {
    fs.readdir(basePath, async (error, files) => {
      if (error) {
        reject(error);
      }

      const data = await Promise.all(files.map(getFile(basePath)));

      const result = data.reduce((result, file) => {
        const { id, ...rest } = file;
        result[id] = rest;
        return result;
      }, {});

      resolve(result);
    });
  });
};
