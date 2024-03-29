import _ from 'lodash';

function makeValue(value) {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
}
const plainFormat = (ast) => {
  const iter = (nodes, fullPath = []) => {
    // eslint-disable-next-line array-callback-return, consistent-return
    const result = nodes.flatMap((node) => {
      const name = [...fullPath, node.key].join('.');
      switch (node.status) {
        case 'updated':
          return [
            `Property '${name}' was updated. From ${makeValue(node.oldValue)} to ${makeValue(node.value)}`,
          ];
        case 'nested':
          return `${iter(node.children, [...fullPath, node.key])}`;
        case 'removed':
          return `Property '${name}' was removed`;
        case 'added':
          return `Property '${name}' was added with value: ${makeValue(node.value)}`;
        default: {
          break;
        }
      }
    });
    return result.filter((str) => str).join('\n');
  };

  return iter(ast);
};

export default plainFormat;
