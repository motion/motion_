(function () {
  Flint.file('inspector/title.js', function (require) {
    Flint.staticStyles('Inspector.Title', {
      '$title': '#_flintdevtools title.Inspector-Title, #_flintdevtools .Inspector-Title.title, #_flintdevtools .ViewInspector-Title.title, #_flintdevtools .Inspector-Title > .title',
      '$closed': '#_flintdevtools closed.Inspector-Title, #_flintdevtools .Inspector-Title.closed, #_flintdevtools .ViewInspector-Title.closed, #_flintdevtools .Inspector-Title > .closed',
      '$inner': '#_flintdevtools inner.Inspector-Title, #_flintdevtools .Inspector-Title.inner, #_flintdevtools .ViewInspector-Title.inner, #_flintdevtools .Inspector-Title > .inner'
    }, {
      '$title': {
        fontWeight: 300,
        borderBottom: '1px solid #eee',
        height: 10,
        margin: [5, 5, 8],
        color: '#999',
        flexFlow: 'row'
      },
      '$closed': {
        marginTop: 1
      },
      '$inner': {
        padding: [4, 10],
        background: '#fff'
      }
    });
    Flint.view('Inspector.Title', function (view, on, $) {
      var open = true;

      function toggle() {
        if (!view.props.onToggle) return;
        view.set('open', open = !open);
        view.props.onToggle(open);
        view.update();
      }

      ;view.render(function () {
        return view.el(
          ['title', 1],
          { onClick: toggle },
          view.el(
            ['inner', 1],
            null,
            view.props.children
          )
        );
      });

      $["closed"] = function (_, _index) {
        return {
          transform: { scale: 0.8 } };
      };

      $["inner"] = function (_, _index) {
        return { margin: [-2, 'auto']
        };
      };
    });
  })
})();
//# sourceMappingURL=title.js.map
