const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

const getCategories = async () => {
  const readDir = Promise.promisify(fs.readdir);

  return readDir(path.join(process.cwd(), 'data')).then(files => {
    return files.map(file => path.basename(file, '.js'));
  });
};

module.exports = getCategories;