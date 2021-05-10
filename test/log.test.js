const { addLayout, configure, getLogger } = require('log4js');
const layout = require('../index');

addLayout('json', layout);
const setUpTest = (config = {}) => {
  configure({
    appenders: {
      log4json: {
        type: 'stdout',
        layout: {
          ...config,
          type: 'json',
        },
      },
    },
    categories: {
      default: {
        appenders: ['log4json'],
        level: 'all',
      },
    },
  });
};

describe('log4json', () => {
  let logger = getLogger('log4json');
  const startTime = '2020-01-01T01:00:00.000Z';
  // eslint-disable-next-line no-underscore-dangle,no-console
  const spyConsole = jest.spyOn(console._stdout, 'write').mockImplementation(() => {
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(1577840400000);
  });

  beforeEach(() => {
    spyConsole.mockClear();
  });

  afterAll(() => {
    spyConsole.mockRestore();
    jest.useRealTimers();
  });

  test('should return stringified JSON', () => {
    setUpTest();
    logger = getLogger();
    logger.info('do some log');
    const log = spyConsole.mock.calls[0][0];
    expect(typeof log).toBe('string');
    expect(() => {
      JSON.parse(log);
    }).not.toThrowError();
  });

  test('should return default props if no args', () => {
    setUpTest();
    logger = getLogger();
    logger.debug();
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).not.toHaveProperty('message');
    expect(result).not.toHaveProperty('category');
    expect(result).toHaveProperty('ts', startTime);
    expect(result).toHaveProperty('level', 'DEBUG');
  });

  test('should have category if is defined', () => {
    setUpTest();
    logger = getLogger('test-category');
    logger.debug();
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('category', 'test-category');
  });

  test('should have default category if it is not omitted', () => {
    setUpTest({
      omitDefaultCategory: false,
    });
    logger = getLogger();
    logger.debug();
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('category', 'default');
  });

  test('should concat all string messages', () => {
    setUpTest();
    logger = getLogger();
    logger.debug('concat', 'this message', 'with this one');
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('message', 'concat this message with this one');
  });

  test('should assign all props in to output', () => {
    setUpTest();
    logger = getLogger();
    logger.debug('extend', { a: 1 }, { b: 2 }, { c: 3 });
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('a', 1);
    expect(result).toHaveProperty('b', 2);
    expect(result).toHaveProperty('c', 3);
  });

  test('should return the stack of error', () => {
    setUpTest();
    logger = getLogger();
    logger.debug('error', new Error('test'));
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('stack');
  });

  test('should concat the message with given separator', () => {
    setUpTest({ separator: '.$.' });
    logger = getLogger();
    logger.debug('concat with', 'this message', 'with this one');
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('message', 'concat with.$.this message.$.with this one');
  });

  test('should format the message with given space', () => {
    [null, 1, 2, 3, 4]
      .forEach((space, index) => {
        setUpTest({ space });
        logger = getLogger();
        logger.info('space');
        const result = spyConsole.mock.calls[index][0];
        expect(result).toBe(`${JSON.stringify(JSON.parse(result), null, space)}\n`);
      });
  });

  test('should omit invalid data', () => {
    setUpTest();
    logger = getLogger('test-category');
    logger.debug('valid', undefined, null);
    const result = JSON.parse(spyConsole.mock.calls[0][0]);
    expect(result).toHaveProperty('message', 'valid');
  });

  test('should change the pre-reserved keys if the config has', () => {
    setUpTest({
      props: {
        ts: '@timestamp',
        level: 'lvl',
        category: 'cat',
        stack: 'error',
        message: 'context',
      },
    });
    logger = getLogger('my-category');
    logger.error('custom props', new Error('stack'));
    const result = JSON.parse(spyConsole.mock.calls[0][0]);

    expect(result).not.toHaveProperty('ts');
    expect(result).toHaveProperty('@timestamp', startTime);

    expect(result).not.toHaveProperty('level');
    expect(result).toHaveProperty('lvl', 'ERROR');

    expect(result).not.toHaveProperty('category');
    expect(result).toHaveProperty('cat', 'my-category');

    expect(result).not.toHaveProperty('stack');
    expect(result).toHaveProperty('error');

    expect(result).not.toHaveProperty('message');
    expect(result).toHaveProperty('context', 'custom props');
  });
});
