var _Object$keys = require('babel-runtime/core-js/object/keys').default;

(function () {
  Flint.file('inspector/view.js', function (require) {
    var _lodash = require('lodash');

    function pathToName(path) {
      var p = path.split(',');
      return p[p.length - 1].split('-')[0];
    }

    function filterProps(props) {
      var leaveOut = ['if', 'repeat', 'style', 'yield', '__flint'];
      return _lodash.omit.apply(null, [props].concat(leaveOut));
    }

    Flint.staticStyles('Inspector.View', {
      '$view': '#_flintdevtools view.Inspector-View, #_flintdevtools .Inspector-View.view, #_flintdevtools .ViewInspector-View.view, #_flintdevtools .Inspector-View > .view',
      '$top': '#_flintdevtools top.Inspector-View, #_flintdevtools .Inspector-View.top, #_flintdevtools .ViewInspector-View.top, #_flintdevtools .Inspector-View > .top',
      '$active': '#_flintdevtools active.Inspector-View, #_flintdevtools .Inspector-View.active, #_flintdevtools .ViewInspector-View.active, #_flintdevtools .Inspector-View > .active',
      '$highlight': '#_flintdevtools highlight.Inspector-View, #_flintdevtools .Inspector-View.highlight, #_flintdevtools .ViewInspector-View.highlight, #_flintdevtools .Inspector-View > .highlight',
      '$Close': '#_flintdevtools .ViewInspector-View .ViewClose',
      '$name': '#_flintdevtools name.Inspector-View, #_flintdevtools .Inspector-View.name, #_flintdevtools .ViewInspector-View.name, #_flintdevtools .Inspector-View > .name',
      '$edit': '#_flintdevtools edit.Inspector-View, #_flintdevtools .Inspector-View.edit, #_flintdevtools .ViewInspector-View.edit, #_flintdevtools .Inspector-View > .edit',
      '$expanded': '#_flintdevtools expanded.Inspector-View, #_flintdevtools .Inspector-View.expanded, #_flintdevtools .ViewInspector-View.expanded, #_flintdevtools .Inspector-View > .expanded',
      '$input': '#_flintdevtools input.Inspector-View, #_flintdevtools .Inspector-View.input, #_flintdevtools .ViewInspector-View.input, #_flintdevtools .Inspector-View > .input',
      '$title': '#_flintdevtools title.Inspector-View, #_flintdevtools .Inspector-View.title, #_flintdevtools .ViewInspector-View.title, #_flintdevtools .Inspector-View > .title',
      '$section': '#_flintdevtools section.Inspector-View, #_flintdevtools .Inspector-View.section, #_flintdevtools .ViewInspector-View.section, #_flintdevtools .Inspector-View > .section'
    }, {
      '$view': {
        position: 'relative',
        pointerEvents: 'auto',
        margin: 10,
        marginBottom: 0,
        padding: [0, 0, 1],
        minWidth: 220,
        minHeight: 34,
        fontSize: 12,
        userSelect: 'none',
        cursor: 'default',
        background: '#fff',
        boxShadow: '0px 2px 16px rgba(0,0,0,0.2)',
        border: '1px solid #ccc',
        borderRadius: 5,
        color: '#333',
        transition: 'all ease-in 60ms',
        opacity: 0
      },
      '$top': {
        flexFlow: 'row'
      },
      '$active': {
        opacity: 1
      },
      '$highlight': {
        border: '2px solid #afb4e2'
      },
      '$Close': {
        top: -5,
        right: -5,
        fontSize: 13
      },
      '$name': {
        fontWeight: 400,
        color: 'rgba(0,0,0,0.8)',
        padding: [8, 8, 0],

        fontSize: 14
      },
      '$edit': {
        padding: [8, 8, 0],
        fontSize: 14,

        marginLeft: 4,
        fontWeight: 400,
        color: 'rgba(24, 101, 227, 0.8)'
      },
      '$expanded': {},
      '$input': {
        borderRadius: 100,
        border: '1px solid #ccc',
        width: '100%',
        padding: [2, 12],
        color: '#333',
        fontSize: 14
      },
      '$title': {
        display: 'none',
        color: '#333',
        fontWeight: 200,
        fontSize: 12,
        margin: [3, 0]
      },
      '$section': {
        background: [0, 0, 0, 0.05]
      }
    });
    Flint.view('Inspector.View', function (view, on, $) {
      var highlight = view.prop('highlight', undefined),
          closing = view.prop('closing', undefined),
          path = view.prop('path', undefined),
          onClose = view.prop('onClose', undefined);

      on.props(function () {
        highlight = view.getProp('highlight');
        closing = view.getProp('closing');
        path = view.getProp('path');
        onClose = view.getProp('onClose');
      });
      var inspect = window.Flint.inspect;
      var name = undefined;
      var active = false;
      var state = {};
      var props = null;
      var writeBack = null;

      function onSet(write) {
        view.props.writeBack(path, write);
      }

      on.delay(60, function () {
        view.set('active', active = true);
        view.update();
      });

      on.unmount(function () {
        delete window._Flint.inspector[path];
      });

      on.props(function () {
        if (closing === true) view.set('active', active = false);
        if (!path) return;

        view.set('name', name = pathToName(path));

        // if not inspecting, inspect
        if (!_Flint.inspector[path]) {
          inspect(path, function (_props, _state, _wb) {
            view.set('props', props = filterProps(_props || {}));
            view.set('state', state = _state || {});
            view.set('writeBack', writeBack = _wb);
            view.update();
            view.update();
          });
        }
        view.update();
      });

      var hasKeys = function hasKeys(o) {
        return o && _Object$keys(o).length > 0;
      };
      var edit = function edit() {
        return _DT.messageEditor({ type: 'focus:element', view: name });
      };view.render(function () {
        return view.el(
          ['view', 1],
          { className: { active: active, highlight: highlight } },
          view.el(['Close', 1], { onClick: onClose, fontSize: 20, size: 35 }),
          view.el(
            ['top', 1],
            null,
            view.el(
              ['name', 1],
              null,
              name
            ),
            Flint.iff(false) && view.el(
              ['edit', 1],
              { if: false, onClick: edit },
              'edit'
            )
          ),
          Flint.iff(hasKeys(props)) && view.el(
            ['Inspector.Section', 1],
            { title: 'Props', if: hasKeys(props), className: 'props' },
            view.el(['Tree', 1], { editable: false, data: props })
          ),
          Flint.iff(hasKeys(state)) && view.el(
            ['Inspector.Section', 2],
            { title: 'State', if: hasKeys(state) },
            view.el(['Tree', 2], {
              editable: true,
              onSet: onSet,
              data: state
            })
          )
        );
      });

      '68270699';

      $["view"] = function (_, _index) {
        return { transform: {
            x: 20
          }
        };
      };

      'c59a100e';
      '14ed20fc';

      $["active"] = function (_, _index) {
        return { transform: {
            x: 0
          }
        };
      };

      '73fd2ce7';
      '4c3860b8';
      '6f330b54';

      $["name"] = function (_, _index) {
        return { margin: [0, 0, -6] };
      };

      '748b11a6';

      $["edit"] = function (_, _index) {
        return { margin: [0, 0, -6] };
      };

      $["expanded"] = function (_, _index) {
        return {
          transform: { y: 0 }
        };
      };

      'a91c0042';
      '22691102';
      '1d45081d';
    });
  })
})();
//# sourceMappingURL=view.js.map
