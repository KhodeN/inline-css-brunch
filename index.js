'use strict';
const anymatch = require('anymatch');
const sass = require('node-sass');
const path = require('path');

const defaultPassthrough = /^node_modules/;

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
        if (this.passthrough(file.path)) {
            return Promise.resolve(file);
        }

        const sassOptions = Object.assign({
            data: file.data,
            includePaths: [
                path.dirname(file.path)
            ]
        }, this.sassOptions);

        return this._renderScss(sassOptions)
            .then(function (result) {
                const payload = JSON.stringify(result.css.toString('utf8'));
                const exports = 'module.exports = ' + payload;
                return {
                    exports,
                    path: file.path,
                    data: ''
                };
            })
    }

    _renderScss(options) {
        return new Promise(function (resolve, reject) {
            sass.render(options, function (err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result);
            });
        });
    }
}

InlineScssCompiler.prototype.brunchPlugin = true;
InlineScssCompiler.prototype.type = 'stylesheet';
InlineScssCompiler.prototype.extension = 'scss';

module.exports = InlineScssCompiler;
