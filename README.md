# inline-css-brunch

Brunch plugin to read your CSS files as strings in JS. This is useful for frameworks like Angular 2 so you don't need to make separate requests for styles.

As of version 2.0.0 of this plugin, it requires Brunch 2.6 or later.

## Install

```sh
npm install -D inline-css-brunch
```

## Configuration

As of version 2.0.0, you can configure where the plugin is used.

```js
exports.config = {
  plugins: {
    inlineCss: {
      passthrough: /^(node_modules)|(app\/styles)/
    }
  }
}
```

### `pattern`

Similar to other plugins, this defines which files Brunch will send to this plugin. If you want it to only handle CSS files from a particular part of your app, this will do it. This value can be a string with wildcards or a RegExp or any array of those things.

### `passthrough`

By default this plugin will create wrapped JS modules out of your CSS strings, however, if you want some of your CSS files to be sent to the stylesheets output, you can do that with this option.

Anything matching this string/RegExp/array will not be wrapped as a JS module, but instead added to the output stylesheets.

By default, this plugin will passthrough anything in the `node_modules` folder. This allows it to be used with the `npm.styles` config option.

If you don't want anything to passthrough, you can pass `false` for this option. However, `npm.styles` will not work in that case.

This behaviour means you don't need to include `css-brunch` in addition to this one. Unless you want the CSS modules.

## Usage

```js
const myCssString = require('./my-css-file.css');
```

If you have JS/TS files with the same base name as your CSS files, and you want to refer to those files without their extension, you may want to include this in your config file:

```js
exports.config = {
  files: {
    javascripts: {
      order: {
        after: [/\.css$/]
      }
    }
  }
}
```

This will force your CSS files to be output later in the file, which means they won't take the alias for the base name.

