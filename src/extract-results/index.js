const _ = require('lodash');
const moment = require('moment');

const toDate = text => {
  const date = text.replace(/bookmark/, '').split('').map(x => {
    const code = x.charCodeAt(0);
    return (code === 160) ? ' ' : String.fromCharCode(code);
  }).join('');

  return moment(date, 'Do MMM YYYY').toDate();
};

const getPosition = text => parseInt(text.split(' / ')[0], 10);
const getFieldSize = text => parseInt(text.split(' / ')[1], 10);

const extractResults = (data) => {
  const results = data.map(columns => {
    const date = columns[1] && toDate(columns[1].textContent);
    const age = moment().diff(date, 'days');
    const race = columns[2] && columns[2].textContent;
    const position = columns[9] && getPosition(columns[9].textContent);
    const fieldSize = columns[9] && getFieldSize(columns[9].textContent);

    return { date, age, race, position, fieldSize };
  });

  return _.reject(results, result => 
    result.date === undefined || 
    result.race.toLowerCase().indexOf('glentress 7') > -1 ||
    (result.race.toLowerCase().indexOf('enduro') === -1 &&
     result.race.toLowerCase().indexOf('tweedlove') === -1) ||
    _.isNaN(result.position));
};

module.exports = extractResults