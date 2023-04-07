const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const stringify = Promise.promisify(require('csv-stringify'));
const write = Promise.promisify(fs.writeFile);

const HEADER = [ 'Rider', 'Score', '# of Races', 'ID', 'Seeding' ];

const generate = async (riders, name, race) => {
  riders.splice(0, 0, HEADER);
  const csv = await stringify(riders);
  console.log(`Generated ${name}...`);

  const folder = path.join(process.cwd(), 'rankings', race);

  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  return write(path.join(folder, name + '.csv'), csv);
};

module.exports = generate;