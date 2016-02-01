(function () {
  Flint.file("main.js", function (require) {
    Flint.staticStyles("Main", {
      "$": "#_flintdevtools .ViewMain"
    }, {
      "$": {
        position: 'fixed',

        top: 0, left: 0,
        right: 0, bottom: 0,
        zIndex: 2147483647
      }
    });
    Flint.view("Main", function (view, on, $) {
      var internal = window.__isDevingDevTools;
      var showInspector = true;view.render(function () {
        return view.el(["link", 1], { rel: "stylesheet", property: "stylesheet", href: "/__/tools/static/tools.css" });
      });view.render(function () {
        return Flint.iff(!internal) && view.el(["link", 2], { if: !internal, rel: "stylesheet", property: "stylesheet", href: "/__/tools/styles.css" });
      });view.render(function () {
        return view.el(["Errors", 1], null);
      });view.render(function () {
        return view.el(["Installer", 1], null);
      });view.render(function () {
        return Flint.iff(showInspector) && view.el(["Menu", 1], { if: showInspector });
      });view.render(function () {
        return Flint.iff(showInspector) && view.el(["Inspector", 1], { if: showInspector });
      });view.render(function () {
        return Flint.iff(false) && view.el(["StateTests", 1], { if: false });
      });

      $["$"] = function (_, _index) {
        return { pointerEvents: internal ? 'auto' : 'none' };
      };
    });
  })
})();
//# sourceMappingURL=main.js.map
