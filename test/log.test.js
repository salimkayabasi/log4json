const jsonLayout = require('../index');

const eventGeneratorWithCategory = (categoryName, ...values) => ({
  startTime: 'startTime',
  level: {
    levelStr: 'mock',
  },
  categoryName,
  data: values,
});

const eventGenerator = (...values) =>
  eventGeneratorWithCategory('default', ...values);

describe('log4json', () => {
  it('should return string', () => {
    const logger = jsonLayout();
    const result = logger(eventGenerator('test'));
    expect(typeof result).toBe('string');
  });
  it('should return default props if no args', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGenerator()));
    expect(result).not.toHaveProperty('msg');
    expect(result).not.toHaveProperty('category');
    expect(result).toHaveProperty('ts', 'startTime');
    expect(result).toHaveProperty('level', 'mock');
  });
  it('should have msg ts and level if no category', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGenerator('test')));
    expect(result).not.toHaveProperty('category');
  });
  it('should have category if is defined', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGeneratorWithCategory('test-category', 'test')));
    expect(result).toHaveProperty('category', 'test-category');
  });
  it('should concat all string messages', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGenerator('concat', 'this message', 'with this one')));
    expect(result).toHaveProperty('msg', 'concat this message with this one');
  });
  it('should assign all props in to output', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGenerator('extend', { a: 1 }, { b: 2 }, { c: 3 })));
    expect(result).toHaveProperty('a', 1);
    expect(result).toHaveProperty('b', 2);
    expect(result).toHaveProperty('c', 3);
  });
  it('should return the stack of error', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGenerator('error', new Error('test'))));
    expect(result).toHaveProperty('stack');
  });
  it('should concat the message with given separator', () => {
    const logger = jsonLayout({ separator: '.$.' });
    const result = JSON.parse(logger(eventGenerator('concat with', 'this message', 'with this one')));
    expect(result).toHaveProperty('msg', 'concat with.$.this message.$.with this one');
  });
  it('should format the message with given space', () => {
    [null, 1, 2, 3, 4]
      .forEach((space) => {
        const logger = jsonLayout({ space });
        const result = logger(eventGenerator('space'));
        expect(result).toBe(JSON.stringify(JSON.parse(result), null, space));
      });
  });
  it('should omit invalid data', () => {
    const logger = jsonLayout();
    const result = JSON.parse(logger(eventGenerator('valid', undefined, null)));
    expect(result).toHaveProperty('msg', 'valid');
  });
});
