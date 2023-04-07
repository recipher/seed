const _ = require('lodash');

const getCategories = entries => {
  return _.chain(entries)
  .uniqBy('category')
  .map('category')
  .value();
};

module.exports = getCategories;