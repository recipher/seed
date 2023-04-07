const _ = require('lodash');

const COUNT = 3;

const pad = (scores, top, count) => scores.concat(_.fill(Array(count - top.length), 0));

const score = (name, results, count = COUNT) => {
  const top = _.chain(results)
  .sortBy(result => result.age)
  .take(count)
  .value();

  // console.log(name, results.length)

  let scores = _.map(top, 'score');

  if (top.length < count) scores = pad(scores, top, count);

  const total = _.reduce(scores, (total, score) => {
    return total + score;
  }, 0);

  return Math.round(total / scores.length);
};

module.exports = score;


