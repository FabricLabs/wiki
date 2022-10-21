'use strict';

// Fabric Core
const Actor = require('@fabric/core/types/actor');
const Federation = require('@fabric/core/types/federation');
const Filesystem = require('@fabric/core/types/filesystem');
// const Service = require('@fabric/core/types/service');

// Fabric HTTP
const HTTPServer = require('@fabric/http/types/server');
const Site = require('@fabric/http/types/site');

/**
 * Generic Markdown Wiki
 * @extends {Site}
 */
class Wiki extends Site {
  /**
   * Create an instance of the {@link Wiki}, complete with an {@link EdgeNode}.
   * @param {Object} [settings] Configuration.
   * @returns {Wiki} Instance of the {@link Wiki}.
   */
  constructor (settings = {}) {
    super(settings);

    if (!this._boundListeners) this._boundListeners = {};

    this.settings =  Object.assign({
      documents: {},
      federation: {
        consensus: {
          constraints: {
            validators: []
          }
        }
      },
      filesystem: {
        path: './stores/fabric-wiki'
      },
      http: {
        interface: '0.0.0.0',
        port: 5555
      },
      state: {
        clock: 0
      },
    }, this.settings, settings);

    this._state = {
      content: this.settings.state
    };

    this.fs = new Filesystem(this.settings.filesystem);
    this.http = new HTTPServer(this.settings.http);
    this.federation = new Federation(this.settings.federation);

    return this;
  }

  async start () {
    this._state.content.status = 'STARTING';

    this.trust(this.fs, 'FILESYSTEM');
    this.trust(this.http, 'HTTP');
    this.trust(this.federation, 'FEDERATION');

    await this.fs.start();
    await this.http.start();
    await this.federation.start();

    this._state.content.status = 'STARTED';
    this.commit();

    return this;
  }

  async stop () {
    this._state.content.status = 'STOPPING';
    await this.federation.stop();
    await this.http.stop();
    await this.fs.stop();
    this._state.content.status = 'STOPPED';
    this.commit();
    return this;
  }

  _handleFilesystemActivity (activity) {
    this.emit('log', `[${(new Date()).toISOString()}] Filesystem Activity: ${JSON.stringify(activity, null, '  ')}`);
    this.commit();
    return this;
  }

  _handleHTTPActivity (activity) {
    this.emit('log', `[${(new Date()).toISOString()}] HTTP Activity: ${JSON.stringify(activity, null, '  ')}`);
    this.emit('activity', `[${(new Date()).toISOString()}] HTTP Activity: ${JSON.stringify(activity, null, '  ')}`);
    this.commit();
    return this;
  }

  _handleTrustedActivity (activity) {
    this.emit('debug', `[${(new Date()).toISOString()}] Trusted Activity: ${JSON.stringify(activity, null, '  ')}`);
    this.commit();
    return this;
  }

  _handleTrustedCommit (activity) {
    this.emit('debug', `[${(new Date()).toISOString()}] Trusted Activity: ${JSON.stringify(activity, null, '  ')}`);
    this.emit('activity', `[${(new Date()).toISOString()}] Trusted Activity: ${JSON.stringify(activity, null, '  ')}`);
    this.commit();
    return this;
  }

  commit () {
    const activity = new Actor({
      created: (new Date().toISOString()),
      content: this.state
    });

    this.emit('activity', activity.toGenericMessage());

    const commit = new Actor({
      type: 'WikiCommit',
      object: this.state
    });

    this.emit('commit', commit.toGenericMessage());

    return this;
  }

  trust (source, name) {
    if (!name) name = (new Actor({ created: (new Date()).toISOString() })).id;
    if (!source || !source.emit) throw new Error('Source does not implement the "emit" function.');

    // Local State
    const state = {
      created: (new Date()).toISOString(),
      object: {
        origin: this.state,
        source: name
      }
    };

    // Determinism
    const actor = new Actor(state);

    // Assign Listeners
    this._boundListeners[actor.id + ':activity'] = source.on('activity', this._handleTrustedActivity.bind(this));
    this._boundListeners[actor.id + ':commit'] = source.on('commit', this._handleTrustedCommit.bind(this));

    // Commit
    this.commit();

    return this;
  }
}

module.exports = Wiki;
