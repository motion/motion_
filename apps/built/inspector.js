var _extends = require('babel-runtime/helpers/extends').default;

var _toArray = require('babel-runtime/helpers/to-array').default;

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

(function () {
  Flint.file('inspector.js', function (require) {
    var _keys = require('./keys');

    var _libInspecting = require('./lib/inspecting');

    var _libInspecting2 = _interopRequireDefault(_libInspecting);

    var _lodash = require('lodash');

    var removeHead = function removeHead(_ref) {
      var _ref2 = _toArray(_ref);

      var l = _ref2[0];

      var ls = _ref2.slice(1);

      return ls;
    };
    var isAlt = function isAlt(cb) {
      return function (e) {
        return e.keyIdentifier === 'Alt' && cb();
      };
    };
    var isEsc = function isEsc(cb) {
      return function (e) {
        return e.keyCode === 27 && cb();
      };
    };

    var setLocal = function setLocal(k, v) {
      return localStorage.setItem('__flint.state.' + k, JSON.stringify(v));
    };
    var getLocal = function getLocal(k, d) {
      return JSON.parse(localStorage.getItem('__flint.state.' + k)) || d;
    };

    var round = Math.round;

    var highlighter = undefined;

    function positionHighlight(node) {
      var bounds = node.getBoundingClientRect();
      var winW = window.innerWidth;
      var winH = window.innerHeight;
      var width = round(bounds.right - bounds.left);
      var height = round(bounds.bottom - bounds.top);
      var opacity = 1;

      if (width >= winW && height >= winH) opacity = 0.2;

      highlighter.setAttribute('style', '\n    top: ' + round(bounds.top) + 'px;\n    left: ' + round(bounds.left) + 'px;\n    width: ' + width + 'px;\n    height: ' + height + 'px;\n    opacity: ' + opacity + ';\n  ');
    }

    function hideHighlight() {
      highlighter.setAttribute('style', '');
    }

    function findPath(node) {
      if (!node || !node.getAttribute) return null;
      var flintid = node.__flintID;
      if (!flintid) return findPath(node.parentNode);
      positionHighlight(node);
      return flintid;
    }

    function tempActive(views) {
      return views.filter(function (v) {
        return !v.temp;
      }).length > 0;
    }

    function pathActive(views, path) {
      return views.filter(function (v) {
        return v.path == path;
      }).length > 0;
    }

    function removeTemp(views) {
      return views.filter(function (v) {
        return !v.temp;
      }).map(function (v) {
        return _extends({}, v, { highlight: false });
      });
    }

    function addTemp(views, path) {
      return [{ path: path, highlight: false, temp: true }].concat(views);
    }

    function setClosing(views, path) {
      return views.map(function (v) {
        if (v.path == path) v.closing = true;
        return v;
      });
    }

    function highlightPath(views, path) {
      return views.map(function (v) {
        if (v.path == path) v.highlight = true;
        return v;
      });
    }

    function toggleView(views, path) {
      if (pathActive(views, path)) {
        return views.map(function (v) {
          if (v.path == path) v.temp = true;
          return v;
        });
      } else {
        var added = { temp: false, highlight: false, closing: false, path: path };
        return [].concat([added], views);
      }
    }

    function internal() {
      return window._Flint;
    }

    function writeBack(path, writePath) {
      var Int = internal();
      var cache = Int.getCache[path];

      // update getCache
      writePath.reduce(function (acc, cur) {
        if (cur == 'root') return acc;

        if (!Array.isArray(cur)) return acc[cur];

        // is end of path: [key, val]

        var _cur = _slicedToArray(cur, 2);

        var key = _cur[0];
        var val = _cur[1];

        var current = acc[key];

        if (typeof current == 'number') val = +val;

        // write
        acc[key] = val;
      }, cache);

      Int.inspectorRefreshing = path;
      Int.getInitialStates[path]();
      Int.viewsAtPath[path].forceUpdate();
      Int.inspectorRefreshing = null;
    }

    Flint.staticStyles('Inspector', {
      '$': '#_flintdevtools .ViewInspector'
    }, {
      '$': {
        position: 'fixed',
        top: 0, right: 0,
        padding: 2
      }
    });
    Flint.view('Inspector', function (view, on, $) {
      var clickOff = undefined,
          hoverOff = undefined,
          lastTarget = undefined;
      var hudActive = false;
      var views = [];

      on.mount(function () {
        view.set('hoverOff', hoverOff = on.mousemove(window, (0, _lodash.throttle)(mouseMove, 40)));
        if (highlighter) return;
        highlighter = document.createElement('div');
        highlighter.className = "_flintHighlighter";
        document.body.appendChild(highlighter);
        view.update();
      });

      // key events
      (0, _keys.onKeyDown)('esc', closeLast);

      var offAlt = undefined;

      var keysCorrect = function keysCorrect(_ref3) {
        var altKey = _ref3.altKey;
        var metaKey = _ref3.metaKey;
        return altKey && !metaKey;
      };

      function checkInspect(e) {
        if (keysCorrect(e)) {
          // wait a little so were not toooo eager
          view.set('offAlt', offAlt = on.delay(180, function () {
            if (keysCorrect(e)) {
              showInspect();
            }
          }));
        } else {
          offAlt && offAlt();
          hideInspect();
        }
      }

      on.keydown(window, checkInspect);
      on.keyup(window, checkInspect);

      function inspect(target) {
        internal().isInspecting = true;
        var path = findPath(target);
        if (path === null) return;
        view.set('views', views = removeTemp(views));
        view.set('views', views = pathActive(views, path) ? highlightPath(views, path) : addTemp(views, path));
        view.update();
      }

      function mouseMove(_ref4) {
        var target = _ref4.target;

        var inspector = ReactDOM.findDOMNode(view);

        if (lastTarget != target) {
          if (inspector.contains(target)) return;

          view.set('lastTarget', lastTarget = target);
          _libInspecting2.default.set(target);
          if (hudActive) inspect(lastTarget);
        }
      }

      function closeLast() {
        if (!views.length) return;
        view.set('views', views = removeHead(views));
        view.update();
      }

      function close(path, e) {
        if (e) e.stopPropagation();
        view.set('views', views = setClosing(views, path));

        on.delay(200, function () {
          view.set('views', views = views.filter(function (v) {
            return path != v.path;
          }));
          view.update();
        });
        view.update();
      }

      function glue(_ref5) {
        var target = _ref5.target;

        var inspector = ReactDOM.findDOMNode(view);
        if (inspector.contains(target)) return;

        view.set('views', views = toggleView(removeTemp(views), findPath(target)));
        return false;
        view.update();
      }

      function showInspect() {
        inspect(lastTarget);
        view.set('hudActive', hudActive = true);
        view.set('clickOff', clickOff = on.click(window, glue));
        view.update();
      }

      function hideInspect() {
        internal().isInspecting = false;
        view.set('hudActive', hudActive = false);
        hideHighlight();
        clickOff && clickOff();
        view.set('views', views = removeTemp(views));
        view.update();
      }

      function onWriteBack(path, data) {
        writeBack(path, data);
        view.update();
      }

      ;view.render(function () {
        return Flint.range(views).map(function (_, _index) {
          return view.el(['Inspector.View', 1, _, _index], _extends({
            repeat: views,
            key: _.path
          }, _, {
            writeBack: onWriteBack,
            onClose: function (e) {
              return close(_.path, e);
            }
          }));
        });
      });
    });
  })
})();
//# sourceMappingURL=inspector.js.map
