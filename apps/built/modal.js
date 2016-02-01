(function () {
  Flint.file('modal.js', function (require) {
    Flint.staticStyles('FlintModal', {
      '$': '#_flintdevtools .ViewFlintModal',
      '$title': '#_flintdevtools title.FlintModal, #_flintdevtools .FlintModal.title, #_flintdevtools .ViewFlintModal.title, #_flintdevtools .FlintModal > .title',
      '$message': '#_flintdevtools message.FlintModal, #_flintdevtools .FlintModal.message, #_flintdevtools .ViewFlintModal.message, #_flintdevtools .FlintModal > .message'
    }, {
      '$': {
        position: 'fixed',

        right: 0,
        minWidth: 80,
        padding: [7, 5],
        margin: 20,
        background: '#fff',
        boxShadow: '0 5px 26px rgba(0,0,0,0.13)',
        border: '1px solid #dadada',
        fontSize: 14,
        transition: 'all ease-in 200ms',
        textAlign: 'center',
        borderRadius: 6,
        pointerEvents: 'auto'
      },
      '$title': {
        fontWeight: 500,
        fontSize: 15,
        margin: [0, 20]
      },
      '$message': {
        fontFamily: "-apple-system, 'Helvetica Nueue', Helvetica, Arial, sans-serif"
      }
    });
    Flint.view('FlintModal', function (view, on, $) {
      view.pause();

      var children = undefined,
          title = undefined,
          open = undefined;

      on.props(setMessage);

      function setMessage() {
        view.set('open', open = view.props.open);

        // cache last children when empty
        if (title && !view.props.title) return view.update();

        view.set('title', title = view.props.title);
        view.set('children', children = view.props.children);
        view.update();
        view.update();
      }

      ;view.render(function () {
        return view.el(['Close', 1], { size: 25 });
      });view.render(function () {
        return Flint.iff(title) && view.el(
          ['title', 1],
          { if: title },
          title
        );
      });view.render(function () {
        return Flint.iff(children) && view.el(
          ['message', 1],
          { if: children },
          children
        );
      });

      $["$"] = function (_, _index) {
        return { top: open ? 0 : -140 };
      };

      $["title"] = function (_, _index) {
        return {
          color: view.props.titleColor || '#222' };
      };
    });
  })
})();
//# sourceMappingURL=modal.js.map
