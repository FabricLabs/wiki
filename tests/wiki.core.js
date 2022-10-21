const assert = require('assert');
const Wiki = require('../services/wiki');
const settings = {
  name: '@fabric/wiki/tests'
};

describe('@fabric/wiki', () => {
  describe('services/wiki', () => {
    it('should exist', () => {
      assert.ok(Wiki);
    });

    it('should create the default wiki', () => {
      assert.ok(Wiki);
      const wiki = new Wiki();
      assert.ok(wiki);
    });

    it('should start the default wiki', async () => {
      assert.ok(Wiki);
      const wiki = new Wiki();
      assert.ok(wiki);
      await wiki.start();
      assert.ok(wiki);
      assert.strictEqual(wiki.state.status, 'STARTED');
      await wiki.stop();
      assert.ok(wiki);
    });

    it('should create the test wiki', () => {
      assert.ok(Wiki);
      const wiki = new Wiki(settings);
      assert.ok(wiki);
    });
  });
});
