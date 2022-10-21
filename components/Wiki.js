'use strict';

const Component = require('@fabric/http/types/component');

class Wiki extends Component {
  constructor (settings) {
    super(settings);

    this.settings = Object.assign({
      handle: 'fabric-wiki'
    }, settings);

    return this;
  }

  _getInnerHTML () {
    return [
      `<${this.settings.handle} />`
    ].join('');
  }
}

module.exports = Wiki;
