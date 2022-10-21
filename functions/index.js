'use strict';

// Core Functions
const Identity = x => JSON.parse(JSON.stringify(x));

// Convenience
const Export = x => (x.export) ? x.export() : Identity(x)
const State = x => x.state || {};

export default {
  Export,
  Identity,
  State
};
