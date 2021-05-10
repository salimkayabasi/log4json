[![npm version](https://badge.fury.io/js/log4json.svg)](http://badge.fury.io/js/log4json)
[![Dependency Status](https://david-dm.org/salimkayabasi/log4json.svg)](https://david-dm.org/salimkayabasi/log4json)
[![DevDependency Status](https://david-dm.org/salimkayabasi/log4json/dev-status.svg)](https://david-dm.org/salimkayabasi/log4json#info=devDependencies)
[![PeerDependency Status](https://david-dm.org/salimkayabasi/log4json/peer-status.svg)](https://david-dm.org/salimkayabasi/log4json#info=peerDependencies)
[![Build Status](https://travis-ci.org/salimkayabasi/log4json.svg?branch=master)](https://travis-ci.org/salimkayabasi/log4json)
[![Greenkeeper badge](https://badges.greenkeeper.io/salimkayabasi/log4json.svg)](https://greenkeeper.io/)

# Log4JSON

JSON layout for `log4js`

## Options

### `separator` (default: `' '`)
Once you have multiple messages as in string format, `logger` will concat all of them and needs a separator.
This value will be used while concatenating the strings.

### `space` (default: `null`)
This parameter will help you to format your output. By default, it will log whole output in one line, otherwise multilines.
Please check the `space` argument on [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) documentation.

### `omitDefaultCategory`  (default: `true`)
In order to reduce the redunnant log size, default category name will be omitted. In case of you want to have category name as always.
You can force logger to include category name even when it is deafult

### `props`
Any of the property names can be overridden. You can override all field names on output.
Default propery names are;
```json
{
  ts: 'ts',
  level: 'level',
  category: 'category',
  stack: 'stack',
  message: 'message',
  callStack: 'callStack',
}
```

## Full Example

https://runkit.com/salimkayabasi/log4json

```javascript
const log4js = require('log4js');
const log4json = require('log4json');

addLayout('log4json', log4json);

configure({
  appenders: {
    log4json: {
      type: 'console',
      layout: {
        type: 'log4json',
        separator: ' | ',
        space: 2,
        omitDefaultCategory: false,
        props: {
          ts: '@timestamp',
          level: 'lvl',
          category: 'cat', // default category will be omitted unless "omitDefaultCategory" is false
          stack: 'error', // only available when an error object is being logged
          message: 'context',
          callStack: 'stack', // only available when "enableCallStack" is true
        }
      }
    }
  },
  categories: {
    default: {
      appenders: ['log4json'],
      level: 'all',
      enableCallStack: true
    }
  }
});

const logger = getLogger('fancy-category', new Error('log4json'));

logger.debug('string logs', 'another string log', {customProp: ['also listed', true]}, 'yet another string');

```

#### output
```json
{
  "customProp": [
    "also listed",
    true
  ],
  "context": "string logs | another string log | yet another string",
  "@timestamp": "2021-05-10T15:25:49.130Z",
  "lvl": "DEBUG",
  "cat": "fancy-category",
  "stack": "src/log4json.js:37:8"
}
```
