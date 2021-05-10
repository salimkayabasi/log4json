/* istanbul ignore next */
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
const isEmpty = (obj) => [Object, Array]
  .includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
// https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11743-L11745
const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
};

const defaultConfig = {
  separator: ' ',
  space: null,
  props: {
    ts: 'ts',
    level: 'level',
    category: 'category',
    stack: 'stack',
    message: 'message',
  },
};

const transform = (config, items) => {
  const messages = [];
  const overlay = {};
  items.filter(Boolean)
    .forEach((item) => {
      if (isObject(item)) {
        const result = item instanceof Error
          ? { [config.props.stack]: item.stack }
          : item;
        Object.assign(overlay, result);
      } else {
        messages.push(item);
      }
    });

  if (!isEmpty(messages)) {
    overlay[config.props.message] = messages.join(config.separator);
  }
  return overlay;
};

const formatter = (event, options) => {
  const output = {
    [options.props.ts]: event.startTime,
    [options.props.level]: event.level.levelStr,
  };

  if (event.categoryName !== 'default') {
    output[options.props.category] = event.categoryName;
  }
  return {
    ...transform(options, event.data),
    ...output,
  };
};

const jsonLayout = (config) => {
  const options = {
    ...defaultConfig,
    ...config,
  };
  return (event) => {
    const result = formatter(event, options);
    return JSON.stringify(result, null, options.space);
  };
};

module.exports = jsonLayout;
