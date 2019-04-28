const fs = require('fs');
const handlebars = require('handlebars');

const createTemplate = filename =>
  new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (error, content) => {
      if (error) {
        reject(error);
      }
      try {
        const template = handlebars.compile(content);
        resolve(template);
      } catch (error) {
        reject(error);
      }
    });
  });

module.exports = createTemplate;
