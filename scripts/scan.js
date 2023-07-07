'use strict';

const Reader = require('../types/reader');

const settings = {
  ignoring: ['node_modules'],
  path: '.'
};

async function main (options) {
  const reader = new Reader(options);
  return reader.scan();
}

main(settings).then((output) => {
  console.log('[SCANNER]', 'Main Process Output:', output);
});
