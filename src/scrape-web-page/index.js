const request = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const get = async id => request(`https://www.rootsandrain.com/rider${id}`);

const load = html => new JSDOM(html.data);

const extractRider = dom => dom.window.document.querySelector('h1').textContent;

const normaliseName = name => {
  return name
    .replace(/\((.*?)\)/, '')
    .replace(/\w\S*/g, name => name.charAt(0).toUpperCase() + name.substr(1).toLowerCase())
    .trim();
};

const extractResults = dom => {
  const table = dom.window.document.querySelector('table.list');
  return Array.from(table.querySelectorAll('tr')).map(row => Array.from(row.querySelectorAll('td')));
};

const scrape = async ({ id, name, count }) => {
  if (id == 0) return { rider: normaliseName(name), name: normaliseName(name), results: [] };

  try {
    const html = await get(id);
    const dom = load(html);
    const rider = normaliseName(extractRider(dom));
    const results = extractResults(dom);

    return { rider, name: normaliseName(name), results, count };
  } catch(e) {
    return { error: e };
  }
};

module.exports = scrape;
