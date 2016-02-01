(function () {
  Flint.file("debounce.js", function (require) {
    // fancy debounce
    // detects if we are in autosave mode

    var sum = function sum(a, b) {
      return a + b;
    };
    var Delay = 300;
    var AutoDelay = 800;
    var Avg = 5000;
    var Clear = 1000 * 10;
    var AutoDetectAvgDiff = 1000;

    Flint.view("Debounce", function (view, on, $) {
      var showKey = undefined,
          timeout = undefined,
          lastTime = undefined,
          delay = undefined,
          curDelay = undefined,
          avgDiff = undefined;
      var isAutoSaving = false;
      var lastFew = [];

      // dont update unless we want to
      view.pause();

      on.props(function () {
        // override
        if (view.props.force) {
          view.set("showKey", showKey = Math.random());
          return show();
        }

        if (view.props.showKey && view.props.showKey == showKey) return;

        view.set("showKey", showKey = view.props.showKey);
        view.set("delay", delay = view.props.delay || Delay);
        view.set("curDelay", curDelay = curDelay || delay);

        // find diff
        var now = Date.now();
        var diff = lastTime ? now - lastTime : Avg; // or init to 5s
        view.set("lastTime", lastTime = now);

        // update queue
        view.set("lastFew", lastFew.unshift(diff), lastFew, true);
        if (lastFew.length > 3) view.set("lastFew", lastFew.pop(), lastFew, true);

        // if its been a while, clear running avg
        if (diff > Clear) {
          view.set("lastFew", lastFew = []);
        }
        // otherwise update avg
        else {
            if (lastFew.length == 3) {
              // find avg of last few
              view.set("avgDiff", avgDiff = lastFew.reduce(sum, 0) / lastFew.length);
              // set autosaving
              view.set("isAutoSaving", isAutoSaving = avgDiff < AutoDetectAvgDiff);
              view.set("curDelay", curDelay = isAutoSaving ? AutoDelay : delay);
            }
          }

        function show() {
          if (view.props.onUpdate) view.props.onUpdate();

          view.update();
        }

        // debounce
        clearTimeout(timeout);
        view.set("timeout", timeout = setTimeout(show, curDelay));
        view.update();
      });
    });
  })
})();
//# sourceMappingURL=debounce.js.map
