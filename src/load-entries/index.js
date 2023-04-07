const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const parse = Promise.promisify(require('csv-parse'));
const readFile = Promise.promisify(fs.readFile);

const categoryByAge = (age, gender) => {
  if (gender === 'female') return 'female';

  // if (age >= 50) return 'grand-vet-male';
  // if (age >= 40) return 'vet-male';
  // if (age >= 30) return 'master-male';
  if (age >= 40) return 'vet-grand-vet-male';
  if (age >= 21) return 'senior-masters-male';
  return 'u21-u18-male';

  // return 'u18-male';
};

const convert = data => {
  const converted = _.map(data, row => {
    const d = { 
      id: row[0], 
      name: [ row[2], row[3] ].join(' '),
      category: categoryByAge(parseInt(row[6], 10), row[4].toLowerCase()).trim().toLowerCase().replace(/ /g, '-').trim(),
      count: undefined, //row[1] === '' ? undefined : row[1],
    };

    return d;
  });

  return converted;

  // return converted.map(entry => {
  //   const category = entry.category.indexOf('female') > -1 
  //     ? 'female' 
  //     : entry.category === 'senior-male' || entry.category === 'master-male'
  //       ? 'senior-male'
  //       // : entry.category === 'super-vet-male' || entry.category === 'vet-male'
  //       //   ? 'vet-male'
  //         : entry.category;

  //   return Object.assign({}, entry, { category });
  // });
};

const load = async filename => {
  const file = await readFile(filename, 'utf8');
  const csv = await parse(file);
  return convert(csv);
}; 

module.exports = load;

