var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

(function () {
  Flint.file('menu.js', function (require) {
    var _keys = require('./keys');

    var _libInspecting = require('./lib/inspecting');

    var _libInspecting2 = _interopRequireDefault(_libInspecting);

    var Tools = _DT;
    var toEditor = Tools.messageEditor;

    Flint.staticStyles('Menu', {
      '$menu': '#_flintdevtools .ViewMenu',
      '$active': '#_flintdevtools active.Menu, #_flintdevtools .Menu.active, #_flintdevtools .ViewMenu.active, #_flintdevtools .Menu > .active',
      '$item': '#_flintdevtools item.Menu, #_flintdevtools .Menu.item, #_flintdevtools .ViewMenu.item, #_flintdevtools .Menu > .item',
      '$first': '#_flintdevtools first.Menu, #_flintdevtools .Menu.first, #_flintdevtools .ViewMenu.first, #_flintdevtools .Menu > .first',
      '$last': '#_flintdevtools last.Menu, #_flintdevtools .Menu.last, #_flintdevtools .ViewMenu.last, #_flintdevtools .Menu > .last',
      '$hl': '#_flintdevtools hl.Menu, #_flintdevtools .Menu.hl, #_flintdevtools .ViewMenu.hl, #_flintdevtools .Menu > .hl',
      '$main': '#_flintdevtools main.Menu, #_flintdevtools .Menu.main, #_flintdevtools .ViewMenu.main, #_flintdevtools .Menu > .main'
    }, {
      '$menu': {
        border: '1px solid #ddd',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        position: 'absolute',

        background: '#fff',
        zIndex: 2147483647,
        transition: 'opacity ease-in 30ms, transform ease-in 30ms',
        opacity: 0,

        pointerEvents: 'none',
        padding: 0
      },
      '$active': {
        pointerEvents: 'auto',
        opacity: 1
      },
      '$item': {
        minWidth: 120,
        cursor: 'pointer',
        flexFlow: 'row'
      },
      '$first': {
        overflow: 'hidden'
      },
      '$last': {
        overflow: 'hidden'
      },
      '$hl': {
        padding: [4, 8]

      },
      '$main': {
        flexGrow: 1
      }
    });
    Flint.viewRoots["Menu"] = 'menu';
    Flint.view('Menu', function (view, on, $) {
      var active = false;
      var top = undefined,
          left = undefined;
      var elements = [];

      // prevent select and show custom cursor when ready for context
      var focused = undefined;
      on.keydown(function () {
        if (_keys.keys.alt && _keys.keys.command) {
          document.body.classList.add('__flintfocus');
          view.set('focused', focused = true);
        }
      });
      on.keyup(function () {
        if (focused) {
          document.body.classList.remove('__flintfocus');
          view.set('focused', focused = false);
        }
      });

      on.click(window, function (e) {
        if (active) {
          e.stopPropagation();
          e.preventDefault();
          view.set('active', active = false);
          return;
        }

        var mode = _keys.keys.alt && _keys.keys.command;
        if (!mode) return;

        e.preventDefault();

        var clientX = e.clientX;
        var clientY = e.clientY;

        view.set('left', left = clientX);
        view.set('top', top = clientY);
        view.set('active', active = true);
        view.set('elements', elements = _libInspecting2.default.all());
        view.update();
      });

      function focusElement(el) {
        return function () {
          toEditor({ type: 'focus:element', key: el.key, view: el.view });
        };
      }

      function focusStyle(el) {
        return function () {
          toEditor({ type: 'focus:style', el: el.el, view: el.view });
        };
      }

      ;view.render(function () {
        return view.el(
          ['menu', 1],
          { className: { internal: true, active: active } },
          Flint.range(elements.filter(function (i) {
            return !!i.view;
          })).map(function (_, _index) {
            return view.el(
              ['item', 1, _, _index],
              {
                repeat: elements.filter(function (i) {
                  return !!i.view;
                }),
                className: {
                  first: _index == 0,
                  last: _index == elements.length - 1
                }
              },
              view.el(
                ['main', 1, _, _index],
                { className: 'hl', onClick: focusElement(_) },
                _.view
              ),
              view.el(
                ['sub', 1, _, _index],
                { className: 'hl', onClick: focusStyle(_) },
                '$'
              )
            );
          })
        );
      });

      var rad = 5;

      $["menu"] = function (_, _index) {
        return {
          borderRadius: rad, top: top,
          left: left, transform: { y: -10 } };
      };

      $["active"] = function (_, _index) {
        return { transform: { y: 0 }
        };
      };

      $["first"] = function (_, _index) {
        return {
          borderTopLeftRadius: rad,
          borderTopRightRadius: rad };
      };

      $["last"] = function (_, _index) {
        return {
          borderBottomLeftRadius: rad,
          borderBottomRightRadius: rad };
      };

      $["hl"] = function (_, _index) {
        return { hover: {
            background: [0, 0, 0, 0.1]
          }
        };
      };
    });
  })
})();
//# sourceMappingURL=menu.js.map
