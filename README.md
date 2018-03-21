[![npm version](https://badge.fury.io/js/log4json.svg)](http://badge.fury.io/js/log4json)
[![Dependency Status](https://david-dm.org/salimkayabasi/log4json.svg)](https://david-dm.org/salimkayabasi/log4json)
[![DevDependency Status](https://david-dm.org/salimkayabasi/log4json/dev-status.svg)](https://david-dm.org/salimkayabasi/log4json#info=devDependencies)
[![PeerDependency Status](https://david-dm.org/salimkayabasi/log4json/peer-status.svg)](https://david-dm.org/salimkayabasi/log4json#info=peerDependencies)
[![Build Status](https://travis-ci.org/salimkayabasi/log4json.svg?branch=master)](https://travis-ci.org/salimkayabasi/log4json)
[![Greenkeeper badge](https://badges.greenkeeper.io/salimkayabasi/log4json.svg)](https://greenkeeper.io/)

### Log4JSON

JSON layout for `log4js`


## Example

```javascript


const log4js = require('log4js');
const log4json = require('log4json');

log4js.addLayout('json', log4json);

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'json', // 'json' || 'colored'
                separator: ' | ', // ' | ' || ' '
                space: 2 // 0 || 2
            }
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'debug'
        }
    }
});


const logger = log4js.getLogger('test-cat');

logger.debug('done', new Error('salim'), 'test', { a: 1, b: 2 });


```
## Output

```

{
  "ts": "2018-03-21T13:51:32.490Z",
  "level": "DEBUG",
  "category": "test-cat",
  "stack": "Error: salim\n    at Object.<anonymous> ...",
  "a": 1,
  "b": 2,
  "msg": "done | test"
}

```