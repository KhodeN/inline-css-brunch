'use strict';
const anymatch = require('anymatch');
const defaultPassthrough = /^node_modules/;

class InlineCssCompiler {
  constructor(config) {
    this.config = config && config.plugins && config.plugins.inlineCss || {};
    if (this.config.html === true) {
      this.pattern = /(\.css)|(\.html)$/i;
    }
    if (this.config.pattern) {
      this.pattern = this.config.pattern;
    }
    if (this.config.passthrough === false) {
      this.passthrough = () => false;
    } else {
      this.passthrough = anymatch(this.config.passthrough || defaultPassthrough);
    }
  }
  
  compile(file) {
    try {
      if (this.passthrough(file.path)) {
        return Promise.resolve(file);
      }
      const payload = JSON.stringify(file.data);
      const exports = 'module.exports = ' + payload;
      return Promise.resolve({exports, path: file.path, data: ''});
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

InlineCssCompiler.prototype.brunchPlugin = true;
InlineCssCompiler.prototype.type = 'stylesheet';
InlineCssCompiler.prototype.extension = 'css';

module.exports = InlineCssCompiler;