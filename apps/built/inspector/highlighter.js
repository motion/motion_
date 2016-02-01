var _Object$keys = require("babel-runtime/core-js/object/keys").default;

(function () {
  Flint.file("inspector/highlighter.js", function (require) {
    var isEmpty = function isEmpty(obj) {
      return _Object$keys(object).length === 0;
    };

    Flint.view("Highlighter", function (view, on, $) {
      ;view.render(function () {
        return Flint.iff(!view.props.highlight || view.props.string.indexOf(view.props.highlight) === -1) && view.el(
          ["name", 1],
          { if: !view.props.highlight || view.props.string.indexOf(view.props.highlight) === -1 },
          view.props.string
        );
      });view.render(function () {
        return Flint.iff(view.props.highlight) && view.el(
          ["span", 1],
          { if: view.props.highlight },
          Flint.range(view.props.string.split()).map(function (_, _index) {
            return view.el(
              ["span", 2, _, _index],
              { repeat: view.props.string.split() },
              Flint.iff(_index > 0) && view.el(
                ["highlight", 1, _, _index],
                { if: _index > 0 },
                view.props.highlight
              ),
              _
            );
          })
        );
      });
    });
  })
})();
//# sourceMappingURL=highlighter.js.map
