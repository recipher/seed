const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const loadEntries = require('./load-entries');
const getCategories = require('./get-categories/from-entries');
const scrapeWebPage = require('./scrape-web-page');
const extractResults = require('./extract-results');
const scoreEvent = require('./score/event');
const scoreRider = require('./score/rider');
const generateCsv = require('./generate-csv');

const RACE = 'britishchamps2022';

const withScore = result => Object.assign({}, result, { score: scoreEvent(result) });

const scrape = async (rider) => {
  const data = await scrapeWebPage(rider);

  if (data.error) return { rider: rider.name, id: rider.id, score: data.error.message };

  const results = extractResults(data.results).map(withScore);
  const score = scoreRider(data.rider, results, data.count);

  return {
    rider: data.rider,
    score,
    results: results.length,
    id: rider.id,
  };
};

const getIds = (entries, category) => {
  const filtered = _.filter(entries, entry => {
    return entry.category === category;
  });
  
  return _.map(filtered, (entry => {
    return { id: entry.id, name: entry.name, count: entry.count };
  }));
};

const generate = async (category, entries) => {
  const ids = getIds(entries, category); // require(`../data/${category}`);
  const riders = await Promise.map(ids, scrape);
  return generateCsv(processScores(_.compact(riders)), category, RACE);
};

const processScores = riders => {
  const ordered = _.sortBy(riders, rider => {
    return -rider.score;
  });

  return _.map(ordered, (rider, index) => Object.assign({}, rider, { position: index + 1 }));
};

(async () => {
  try {
    const entries = await loadEntries(path.join(process.cwd(), 'data', RACE + '.csv'));
    const categories = await getCategories(entries);
    await Promise.map(categories, category => generate(category, entries));
  } catch(e) {
    console.log(e);
  }
})();
