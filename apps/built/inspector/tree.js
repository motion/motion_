var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

(function () {
  Flint.file('inspector/tree.js', function (require) {
    var _libLens = require('../lib/lens');

    var _libLens2 = _interopRequireDefault(_libLens);

    Flint.staticStyles('Tree', {
      '$': '#_flintdevtools .ViewTree'
    }, {
      '$': {
        pointerEvents: 'auto',
        marginLeft: -10
      }
    });
    Flint.viewRoots["Tree"] = 'Leaf';
    Flint.view('Tree', function (view, on, $) {
      var query = '';

      var search = function search(q) {
        query === '' || view.props.validateQuery(query) ? view.set('query', query = q) : false;
        view.update();
      };
      var getOriginal = function getOriginal(path) {
        return (0, _libLens2.default)(view.props.data, path);
      };view.render(function () {
        return view.el(['Leaf', 1], {
          data: view.props.data,
          onClick: view.props.onClick,
          id: view.props.id,
          getOriginal: getOriginal,
          query: query,
          label: 'root',
          editable: view.props.editable,
          root: true,
          validateQuery: function (query) {
            return query.length >= 2;
          },
          isExpanded: view.props.isExpanded || function () {
            return false;
          },
          interactiveLabel: view.props.interactiveLabel,
          onSet: function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return view.props.onSet(args);
          }
        });
      });
    });
  })
})();
//# sourceMappingURL=tree.js.map
