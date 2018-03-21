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