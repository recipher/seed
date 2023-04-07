const _ = require('lodash');

const WEIGHTINGS = {
  'enduro world series': 1,
  'crankworx': 1,
  'scottish enduro series': 100,
  'gravity enduro': 100,
  'british enduro': 100,
  'ard rock': 100,
  'ard moors': 100,
  'pmba': 100,
  'tweedlove': 200,
  'champs': 200,
  'default': 400
};

const MAX_SCORE = 1000000;
const ONE_YEAR = 365;

const score = result => {
  const race = result.race.toLowerCase();

  const weighting = _.keys(WEIGHTINGS).reduce((memo, weighting) => {
    return (race.indexOf(weighting) > -1) ? weighting : memo;
  }, 'default');

  const score = MAX_SCORE - (Math.ceil(result.age / ONE_YEAR) * result.position * WEIGHTINGS[weighting]);

  return score;
};

module.exports = score;


