const _ = require('lodash');

const defaultConfig = {
  separator: ' ',
};

const transform = (config, items) => {
  const messages = [];
  const overlay = {};

  _.compact(items)
    .forEach((item) => {
      if (_.isObject(item)) {
        const result = item instanceof Error
          ? { stack: item.stack }
          : item;
        _.assignIn(overlay, result);
      } else {
        messages.push(item);
      }
    });

  if (!_.isEmpty(messages)) {
    overlay.msg = messages.join(config.separator);
  }
  return overlay;
};

const formatter = (event, config) => {
  const output = {
    ts: event.startTime,
    level: event.level.levelStr,
  };

  if (event.categoryName !== 'default') {
    output.category = event.categoryName;
  }

  return _.assignIn(transform(config, event.data), output);
};

const jsonLayout = (config) => {
  const options = _.assignIn(defaultConfig, config);
  return (event) => {
    const result = formatter(event, options);
    return JSON.stringify(result, null, options.space);
  };
};

module.exports = jsonLayout;
