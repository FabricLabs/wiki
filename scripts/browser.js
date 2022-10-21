'use strict';

if (!document || !window) throw new Error('Unable to find browser context.');

// Settings
const EMPTY_BUFFER = Buffer.from('', 'hex');

// Fabric Types
const Actor = require('@fabric/core/types/actor');

async function main (input = EMPTY_BUFFER) {
  const state = { input: input };
  const actor = new Actor(state);
  const json = actor.toGenericMessage();
  return Buffer.from(json, 'utf8');
}

main({ name: '@fabric/wiki' }).catch((exception) => {
  console.error('[WIKI:BROWSER]', 'Main Process Exception:', exception);
}).then((output) => {
  console.log('[WIKI:BROWSER]', 'Main Process Output:', output);
});
