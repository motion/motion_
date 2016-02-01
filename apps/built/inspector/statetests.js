var _extends = require('babel-runtime/helpers/extends').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

(function () {
  Flint.file('inspector/statetests.js', function (require) {
    var _mouseEventOffset = require('mouse-event-offset');

    var _mouseEventOffset2 = _interopRequireDefault(_mouseEventOffset);

    Flint.view('StateTests', function (view, on, $) {
      ;view.render(function () {
        return view.el(['Tests.Name', 1], null);
      });view.render(function () {
        return view.el(['Tests.Boolean', 1], null);
      });view.render(function () {
        return view.el(['Tests.Counter', 1], null);
      });view.render(function () {
        return view.el(['Tests.Props', 1], null);
      });view.render(function () {
        return view.el(['Tests.Circles', 1], null);
      });
    });
    Flint.view('Tests.Boolean', function (view, on, $) {
      var dead = false;view.render(function () {
        return view.el(
          ['h1', 1],
          null,
          'is tupac dead? ',
          dead.toString()
        );
      });view.render(function () {
        return view.el(
          ['button', 1],
          { onClick: function () {
              view.set('dead', dead = !dead);
              view.update();
            } },
          'toggle'
        );
      });
    });
    Flint.staticStyles('Tests.Props', {
      '$': '#_flintdevtools .ViewTests-Props'
    }, {
      '$': { marginTop: 20 }
    });
    Flint.view('Tests.Props', function (view, on, $) {
      var name = 'a string';view.render(function () {
        return view.el(['input', 1], {
          '__flintValue': name,
          '__flintOnChange': function (__flintval__) {
            view.set('name', name = __flintval__);
            view.update();
          }
        });
      });view.render(function () {
        return view.el(['Test.PropsChild', 1], { name: name });
      });
    });
    Flint.view('Test.PropsChild', function (view, on, $) {
      var name = view.prop('name', undefined);
      on.props(function () {
        name = view.getProp('name');
      });
      var count = 0;view.render(function () {
        return view.el(
          ['h1', 1],
          null,
          'my name is ',
          name
        );
      });view.render(function () {
        return view.el(
          ['h4', 1],
          null,
          'counter to test state ',
          count
        );
      });view.render(function () {
        return view.el(
          ['button', 1],
          { onClick: function () {
              view.set('count', count++, count, true);
              view.update();
            } },
          'up'
        );
      });
    });
    Flint.view('Tests.Counter', function (view, on, $) {
      var count = 0;view.render(function () {
        return view.el(
          ['h1', 1],
          null,
          'count is ',
          count
        );
      });view.render(function () {
        return view.el(
          ['button', 1],
          { onClick: function () {
              view.set('count', count++, count, true);
              view.update();
            } },
          'up'
        );
      });view.render(function () {
        return view.el(
          ['button', 2],
          { onClick: function () {
              view.set('count', count--, count, true);
              view.update();
            } },
          'down'
        );
      });
    });
    Flint.view('Tests.Deep', function (view, on, $) {
      var person = { name: 'nick', tools: ['js', 'juggling balls', 'coffee'] };view.render(function () {
        return view.el(
          ['h1', 1],
          null,
          'deep'
        );
      });view.render(function () {
        return view.el(
          ['h2', 1],
          null,
          JSON.stringify(person)
        );
      });
    });
    Flint.view('Tests.Name', function (view, on, $) {
      var first = 'nick';
      var last = 'cammarata';view.render(function () {
        return view.el(
          ['h2', 1],
          null,
          'name is ',
          first,
          ' ',
          last
        );
      });view.render(function () {
        return view.el(['input', 1], {
          '__flintValue': first,
          '__flintOnChange': function (__flintval__) {
            view.set('first', first = __flintval__);
            view.update();
          }
        });
      });view.render(function () {
        return view.el(['input', 2], {
          '__flintValue': last,
          '__flintOnChange': function (__flintval__) {
            view.set('last', last = __flintval__);
            view.update();
          }
        });
      });view.render(function () {
        return view.el(
          ['button', 1],
          { onClick: function () {
              view.set('first', first = 'nate');
              view.set('last', last = 'wienert');
              view.update();
            } },
          'nateify'
        );
      });
    });
    Flint.staticStyles('Tests.Circles', {
      '$circles': '#_flintdevtools circles.Tests-Circles, #_flintdevtools .Tests-Circles.circles, #_flintdevtools .ViewTests-Circles.circles, #_flintdevtools .Tests-Circles > .circles'
    }, {
      '$circles': { position: 'relative', background: '#eee', height: 400, width: 400 }
    });
    Flint.view('Tests.Circles', function (view, on, $) {
      var coords = [[200, 200]];

      function addCircle(click) {
        view.set('coords', coords.push((0, _mouseEventOffset2.default)(click)), coords, true);
        view.update();
      }

      ;view.render(function () {
        return view.el(
          ['circles', 1],
          { onClick: addCircle },
          Flint.range(coords).map(function (_, _index) {
            return view.el(['Tests.Circle', 1, _, _index], {
              repeat: coords,
              key: '' + _[0] + _[1],
              left: _[0],
              top: _[1]
            });
          })
        );
      });
    });
    Flint.view('Tests.Circle', function (view, on, $) {
      var c = function c() {
        return Math.round(Math.random() * 255);
      };
      var base = {
        background: [c(), c(), c()],
        position: 'absolute',
        top: view.props.top,
        left: view.props.left,
        width: 118, height: 29,
        borderRadius: 27
      };
      var style = function style(scale) {
        return _extends({}, base, { transform: { scale: scale } });
      };view.render(function () {
        return view.el(['circle', 1], { style: style(1) });
      });
    });
  })
})();
//# sourceMappingURL=statetests.js.map
