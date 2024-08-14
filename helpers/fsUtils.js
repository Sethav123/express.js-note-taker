const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 * Function to write data to the JSON file given a destination and some content
 * @param {string} destination The file you want to write to.
 * @param {object} content The content you want to write to the file.
 * @returns {Promise<void>} A promise that resolves when the file is written.
 */
const writeToFile = (destination, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
      err ? reject(err) : resolve(`\nData written to ${destination}`)
    );
  });

/**
 * Function to read data from a given file and append some content
 * @param {object} content The content you want to append to the file.
 * @param {string} file The path to the file you want to save to.
 * @returns {Promise<void>} A promise that resolves when the file is updated.
 */
const readAndAppend = (content, file) =>
  readFromFile(file, 'utf8')
    .then((data) => {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      return writeToFile(file, parsedData);
    });

module.exports = { readFromFile, writeToFile, readAndAppend };
