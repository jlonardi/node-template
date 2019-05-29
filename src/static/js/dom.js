const mapProps = props => {
  const keys = Object.keys(props);
  const mapToString = _.map(k => `${k}="${props[k]}"`);
  return mapToString(keys).join(' ');
};

const mappable = x => x.length > 0;

const joinChildren = child => (_.isArray(child) ? child.join('') : child);

const mapChildrenToString = child => joinChildren(child);

const parseChildren = children => (mappable(children) ? mapChildrenToString(children) : children);

const createElement = (tag, props, ...children) =>
  _.isEmpty(props) ? `<${tag}/>` : `<${tag} ${mapProps(props)}>${parseChildren(children)}</${tag}>`;

const filterEmptyArgs = _.filter(x => x !== undefined);
const invokeArgs = _.map(x => (_.isFunction(x) ? x() : x));

const mapArgFunctions = _.compose(
  invokeArgs,
  filterEmptyArgs
);

const create = tag => (props = {}) => (...args) =>
  createElement(tag, props, ...mapArgFunctions(args));

export const li = create('li');
export const p = create('p');
export const div = create('div');
export const img = create('img');
