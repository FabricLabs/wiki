'use strict';

const fs = require('fs');
const path = require('path');
const marked = require('marked');

class MarkdownScanner {
  constructor (options = {}) {
    this.path = options.path || '.';
    this.ignoring = options.ignoring || ['node_modules'];
    this.linkMap = {};
  }

  scan () {
    this.scanPath(this.path);
    return this.getLinks();
  }

  scanPath (directoryPath) {
    const files = fs.readdirSync(directoryPath);
    for (let file of files) {
      let fullPath = path.join(directoryPath, file);
      let stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        if (!this.ignoring.includes(file)) {
          this.scanPath(fullPath);
        }
      } else if (path.extname(file) === '.md') {
        this.scanFile(fullPath);
      }
    }
  }

  scanFile (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const tokens = marked.lexer(fileContent);
    const links = tokens.links;
    for (let slug in links) {
      this.addLink(slug, links[slug], filePath);
    }
  }

  addLink (slug, linkToken, filePath) {
    if (this.linkMap[slug]) {
      this.linkMap[slug].count += 1;
      this.linkMap[slug].sources.push(filePath);
    } else {
      this.linkMap[slug] = {
        slug: slug,
        link: linkToken.href,
        count: 1,
        sources: [filePath],
      };
    }
  }

  getLinks () {
    let links = Object.values(this.linkMap);
    links.sort((a, b) => b.count - a.count);
    return links;
  }
}

module.exports = MarkdownScanner;
