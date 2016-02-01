var _Object$keys = require('babel-runtime/core-js/object/keys').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

(function () {
  Flint.file('inspector/leaf.js', function (require) {
    var _md5OMatic = require('md5-o-matic');

    var _md5OMatic2 = _interopRequireDefault(_md5OMatic);

    var _libGetType = require('../lib/getType');

    var _libGetType2 = _interopRequireDefault(_libGetType);

    var _ellipsize = require('ellipsize');

    var _ellipsize2 = _interopRequireDefault(_ellipsize);

    var PATH_PREFIX = '.root.';
    var contains = function contains(string, substring) {
      return string.indexOf(substring) !== -1;
    };
    var isPrimitive = function isPrimitive(v) {
      return (0, _libGetType2.default)(v) !== 'Object' && (0, _libGetType2.default)(v) !== 'Array';
    };

    var noop = function noop() {};

    Flint.staticStyles('Leaf', {
      '$leaf': '#_flintdevtools .ViewLeaf',
      '$helper': '#_flintdevtools helper.Leaf, #_flintdevtools .Leaf.helper, #_flintdevtools .ViewLeaf.helper, #_flintdevtools .Leaf > .helper',
      '$boolean': '#_flintdevtools boolean.Leaf, #_flintdevtools .Leaf.boolean, #_flintdevtools .ViewLeaf.boolean, #_flintdevtools .Leaf > .boolean',
      '$number': '#_flintdevtools number.Leaf, #_flintdevtools .Leaf.number, #_flintdevtools .ViewLeaf.number, #_flintdevtools .Leaf > .number',
      '$string': '#_flintdevtools string.Leaf, #_flintdevtools .Leaf.string, #_flintdevtools .ViewLeaf.string, #_flintdevtools .Leaf > .string',
      '$function': '#_flintdevtools function.Leaf, #_flintdevtools .Leaf.function, #_flintdevtools .ViewLeaf.function, #_flintdevtools .Leaf > .function',
      '$colon': '#_flintdevtools colon.Leaf, #_flintdevtools .Leaf.colon, #_flintdevtools .ViewLeaf.colon, #_flintdevtools .Leaf > .colon',
      '$name': '#_flintdevtools name.Leaf, #_flintdevtools .Leaf.name, #_flintdevtools .ViewLeaf.name, #_flintdevtools .Leaf > .name',
      '$children': '#_flintdevtools children.Leaf, #_flintdevtools .Leaf.children, #_flintdevtools .ViewLeaf.children, #_flintdevtools .Leaf > .children',
      '$type': '#_flintdevtools type.Leaf, #_flintdevtools .Leaf.type, #_flintdevtools .ViewLeaf.type, #_flintdevtools .Leaf > .type'
    }, {
      '$leaf': {
        padding: [1, 0],
        fontSize: 13
      },
      '$helper': { color: '#ffff05' },
      '$boolean': { color: '#32a3cd', fontWeight: 700 },
      '$number': { color: '#b92222', marginTop: 2, fontWeight: 500 },
      '$string': { color: '#698c17' },
      '$function': { marginLeft: 10, marginTop: 2, color: '#962eba' },
      '$colon': {
        opacity: 0.3,
        color: '#000'
      },
      '$name': {
        color: "#ff2f2f",
        fontWeight: 400,
        margin: ['auto', 0]
      },
      '$children': {
        paddingLeft: 10
      },
      '$type': {
        margin: [1, 0, 0, 8],
        opacity: 0.7,
        flexFlow: 'row'
      }
    });
    Flint.viewRoots["Leaf"] = 'leaf';
    Flint.view('Leaf', function (view, on, $) {
      var isExpanded = view.prop('isExpanded', undefined),
          data = view.prop('data', undefined),
          prefix = view.prop('prefix', undefined),
          query = view.prop('query', undefined),
          label = view.prop('label', undefined),
          id = view.prop('id', undefined),
          editable = view.prop('editable', undefined);
      on.props(function () {
        isExpanded = view.getProp('isExpanded');
        data = view.getProp('data');
        prefix = view.getProp('prefix');
        query = view.getProp('query');
        label = view.getProp('label');
        id = view.getProp('id');
        editable = view.getProp('editable');
      });
      var getOriginal = view.prop('getOriginal', noop),
          onSet = view.prop('onSet', noop),
          onClick = view.prop('onClick', noop);

      on.props(function () {
        getOriginal = view.getProp('getOriginal');
        onSet = view.getProp('onSet');
        onClick = view.getProp('onClick');
      });
      view.pause();

      var rootPath = undefined,
          path = undefined,
          _data = undefined,
          type = undefined,
          key = undefined,
          original = undefined,
          expanded = undefined;
      var dataKeys = [];
      var _query = '';

      var isInitiallyExpanded = function isInitiallyExpanded() {
        return view.props.root || !_query && isExpanded(path, data) || !contains(path, _query) && typeof getOriginal === 'function';
      };

      var transformData = function transformData() {
        var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        data = _Object$keys(_data).sort();
      };

      on.props(function () {
        view.set('rootPath', rootPath = prefix + '.' + label);
        view.set('key', key = label.toString());
        view.set('path', path = rootPath.substr(PATH_PREFIX.length));
        // originally was stream of ||s, but 0 was turning into false
        view.set('_data', _data = data);

        // multiline strings
        if (typeof _data === 'string' && _data.indexOf('\n') > -1) {
          view.set('_data', _data = _data.split('\n'));
        }

        if (_data) view.set('dataKeys', dataKeys = _Object$keys(_data).sort());

        if (_data === undefined) view.set('_data', _data = data);
        if (_data === undefined) view.set('_data', _data = {});
        view.set('type', type = (0, _libGetType2.default)(_data));
        view.set('_query', _query = query || '');

        if (view.props.root) view.set('expanded', expanded = true);else if (_query) view.set('expanded', expanded = !contains(label, _query));

        if (query && !_query) view.set('expanded', expanded = isInitiallyExpanded());

        view.update();
        view.update();
      });

      function toggle(e) {
        if (!view.props.root) view.set('expanded', expanded = !expanded);

        view.update();
        onClick(_data);
        e.stopPropagation();
        view.update();
      }

      var getLeafKey = function getLeafKey(key, value) {
        return isPrimitive(value) ? key + ':' + (0, _md5OMatic2.default)(String(key)) : key + '[' + (0, _libGetType2.default)(value) + ']';
      };

      var format = function format(key) {
        return view.el(['Highlighter', 1], { string: key, highlight: _query });
      };

      var fnParams = function fnParams(fn) {
        return fn.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '').match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(/,/);
      };

      var getLabel = function getLabel(type, val, sets, editable) {
        return view.el(['Label', 1], {
          val: val,
          editable: editable,
          onSet: function (_) {
            return onSet([sets, _]);
          }
        });
      };view.render(function () {
        return view.el(
          ['leaf', 1],
          { className: rootPath },
          Flint.iff(!view.props.root) && view.el(
            ['label', 1],
            { if: !view.props.root, htmlFor: id, onClick: toggle },
            view.el(
              ['key', 1],
              null,
              view.el(
                ['name', 1],
                null,
                format(key)
              ),
              getLabel('key', key, key, false)
            ),
            view.el(
              ['colon', 1],
              null,
              ':'
            ),
            Flint.iff(type == 'Function') && view.el(
              ['expand', 1],
              { className: 'function', if: type == 'Function' },
              view.el(
                ['i', 1],
                null,
                'fn (',
                fnParams(_data).join(', '),
                ')'
              )
            ),
            Flint.iff(type == 'Array') && view.el(
              ['expand', 2],
              { if: type == 'Array' },
              view.el(
                ['type', 1],
                null,
                'Array[',
                _data.length,
                ']'
              )
            ),
            Flint.iff(type == 'Object') && view.el(
              ['expand', 3],
              { if: type == 'Object' },
              view.el(
                ['type', 2],
                null,
                '{}   ' + dataKeys.length + ' keys'
              )
            ),
            Flint.iff(['Array', 'Object', 'Function'].indexOf(type) == -1) && view.el(
              ['value', 1],
              { if: ['Array', 'Object', 'Function'].indexOf(type) == -1, className: type.toLowerCase() },
              Flint.iff(type.toLowerCase() == 'string') && view.el(
                ['str', 1],
                { if: type.toLowerCase() == 'string' },
                format((0, _ellipsize2.default)(String(_data), 25))
              ),
              Flint.iff(type.toLowerCase() != 'string') && view.el(
                ['else', 1],
                { if: type.toLowerCase() != 'string' },
                format(String(_data))
              ),
              getLabel('val', _data, key, editable)
            )
          ),
          view.el(
            ['children', 1],
            null,
            Flint.iff(expanded && !isPrimitive(_data)) && Flint.range(dataKeys).map(function (_, _index) {
              return view.el(
                ['child', 1, _, _index],
                {
                  if: expanded && !isPrimitive(_data),
                  repeat: dataKeys },
                Flint.iff(_.indexOf('__') == -1) && view.el(['Leaf', 1, _, _index], {
                  if: _.indexOf('__') == -1,
                  key: getLeafKey(_, _data[_]),
                  onSet: function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                      args[_key] = arguments[_key];
                    }

                    return onSet.apply(undefined, [key].concat(args));
                  },
                  data: _data[_],
                  editable: editable,
                  label: _,
                  prefix: rootPath,
                  onClick: onClick,
                  id: id,
                  query: _query,
                  getOriginal: original ? null : getOriginal,
                  isExpanded: isExpanded
                })
              );
            })
          )
        );
      });

      var row = {
        flexFlow: 'row'
      };

      $["label"] = function (_, _index) {
        return [row, {
          position: 'relative',
          color: 'rgba(0,0,0,0.8)',
          opacity: 1,
          alignItems: 'baseline'
        }];
      };

      $["key"] = function (_, _index) {
        return [row, {
          color: 'rgba(0,0,0,0.9)',
          margin: [0],
          fontWeight: 'bold'
        }];
      };

      $["expand"] = function (_, _index) {
        return [row, {}];
      };

      $["value"] = function (_, _index) {
        return [row, {
          position: 'relative',
          margin: [0, 4, 0]
        }];
      };
    });
  })
})();
//# sourceMappingURL=leaf.js.map
