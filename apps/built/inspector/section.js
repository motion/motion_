(function () {
  Flint.file('inspector/section.js', function (require) {
    Flint.staticStyles('Inspector.Section', {
      '$': '#_flintdevtools .ViewInspector-Section',
      '$body': '#_flintdevtools body.Inspector-Section, #_flintdevtools .Inspector-Section.body, #_flintdevtools .ViewInspector-Section.body, #_flintdevtools .Inspector-Section > .body',
      '$inactive': '#_flintdevtools inactive.Inspector-Section, #_flintdevtools .Inspector-Section.inactive, #_flintdevtools .ViewInspector-Section.inactive, #_flintdevtools .Inspector-Section > .inactive'
    }, {
      '$': {
        padding: [5, 0]
      },
      '$body': {
        padding: [0, 12]
      },
      '$inactive': {
        display: 'none'
      }
    });
    Flint.view('Inspector.Section', function (view, on, $) {
      var open = true;view.render(function () {
        return view.el(
          ['Inspector.Title', 1],
          { onToggle: function (val) {
              view.set('open', open = val);
              view.update();
            } },
          view.props.title
        );
      });view.render(function () {
        return view.el(
          ['body', 1],
          null,
          view.props.children
        );
      });
    });
  })
})();
//# sourceMappingURL=section.js.map
