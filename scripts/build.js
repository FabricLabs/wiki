'use strict';

// Settings
const settings = require('../settings/local');

// Types
const Compiler = require('@fabric/http/types/compiler');

// Components
const Wiki = require('../components/wiki');

// Program Body
async function main (input = {}) {
  const wiki = new Wiki(input);
  const compiler = new Compiler({
    document: wiki
  });

  await compiler.compileTo('assets/index.html');

  return {
    wiki: wiki.id
  };
}

// Run Program
main(settings).catch((exception) => {
  console.error('[BUILD:WIKI]', '[EXCEPTION]', exception);
}).then((output) => {
  console.log('[BUILD:WIKI]', '[OUTPUT]', output);
});
