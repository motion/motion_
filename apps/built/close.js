(function () {
  Flint.file('close.js', function (require) {
    Flint.staticStyles('Close', {
      '$': '#_flintdevtools .ViewClose'
    }, {
      '$': {
        position: 'absolute',
        right: 0,
        top: 0,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 1,
        opacity: 0.15,
        cursor: 'pointer',
        transition: 'all ease-in 200ms'

      }
    });
    Flint.viewRoots["Close"] = 'close';
    Flint.view('Close', function (view, on, $) {
      ;view.render(function () {
        return view.el(
          ['close', 1],
          { onClick: view.props.onClick },
          'x'
        );
      });

      $["$"] = function (_, _index) {
        return { fontSize: view.props.fontSize || 13,
          width: view.props.size || 50,
          height: view.props.size || 50, ':hover': {
            opacity: 0.4
          }
        };
      };
    });
  })
})();
//# sourceMappingURL=close.js.map
