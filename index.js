'use strict';
const anymatch = require('anymatch');
const defaultPassthrough = /^node_modules/;
var sass = require('node-sass');

class InlineScssCompiler {
  constructor(config) {
    this.config = config && config.plugins && config.plugins.inlineScss || {};
    this.sassOptions = this.config.options || {};

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
      const css = sass.renderSync(Object.assign({data: file.data}, this.sassOptions)).css;
      const payload = JSON.stringify(css.toString('utf8'));
      const exports = 'module.exports = ' + payload;
      return Promise.resolve({exports, path: file.path, data: ''});
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

InlineScssCompiler.prototype.brunchPlugin = true;
InlineScssCompiler.prototype.type = 'stylesheet';
InlineScssCompiler.prototype.extension = 'scss';

module.exports = InlineScssCompiler;