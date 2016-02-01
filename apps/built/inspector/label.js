var _extends = require('babel-runtime/helpers/extends').default;

(function () {
  Flint.file('inspector/label.js', function (require) {
    var _lodash = require('lodash');

    Flint.staticStyles('Label', {
      '$input': '#_flintdevtools input.Label, #_flintdevtools .Label.input, #_flintdevtools .ViewLabel.input, #_flintdevtools .Label > .input',
      '$focus': '#_flintdevtools focus.Label, #_flintdevtools .Label.focus, #_flintdevtools .ViewLabel.focus, #_flintdevtools .Label > .focus'
    }, {
      '$input': {
        position: 'absolute',
        top: 0,
        left: -1,
        right: 0,
        color: '#333',
        padding: 1,
        width: 140,
        outline: 'none',
        border: 'none',

        opacity: 0,
        boxShadow: '1px 1px 2px rgba(0,0,0,0.4)'
      },
      '$focus': {
        opacity: '1 !important'
      }
    });
    Flint.view('Label', function (view, on, $) {
      var val = view.prop('val', undefined),
          editable = view.prop('editable', undefined),
          onSet = view.prop('onSet', undefined);

      on.props(function () {
        val = view.getProp('val');
        editable = view.getProp('editable');
        onSet = view.getProp('onSet');
      });
      var input = null;
      var focus = undefined,
          newVal = undefined;

      on.props(function () {
        if (!focus) view.set('newVal', newVal = val);
        view.update();
      });

      var onFocus = function onFocus(e) {
        if (!editable) return;
        if ((0, _lodash.isBoolean)(val)) return onSet(!val);
        view.set('focus', focus = true);
        e.stopPropagation();
        view.update();
      };

      var onBlur = function onBlur(e) {
        view.set('focus', focus = false);
        view.update();
      };

      var onChange = function onChange(e) {
        view.set('newVal', newVal = e.target.value);
        view.update({ immediate: true });

        if ((0, _lodash.isNumber)(val)) {
          // dont let them change from num to str
          if (newVal === '' || isNaN(newVal)) return;
        }

        // todo: debate
        if (newVal === 'false') view.set('newVal', newVal = false);
        if (newVal === 'true') view.set('newVal', newVal = true);
        onSet(newVal);
        view.update();
      };

      var tabIndex = function tabIndex(editable) {
        return editable ? {} : { tabIndex: 5000, disabled: true };
      };view.render(function () {
        return view.el(['input', 1], _extends({
          defaultValue: val.toString(),
          value: newVal,
          className: { focus: focus },
          size: Math.max(4, val && val.length || 0),
          spellCheck: false,
          onMouseDown: onFocus,
          onFocus: onFocus,
          onEnter: onBlur
        }, tabIndex(editable), { onFocus: onFocus, onBlur: onBlur, onChange: onChange }));
      });

      $["input"] = function (_, _index) {
        return { // nice cursor on boolean toggle
          cursor: (0, _lodash.isBoolean)(val) ? 'pointer' : 'auto' };
      };
    });
  })
})();
//# sourceMappingURL=label.js.map
