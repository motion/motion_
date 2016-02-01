(function () {
  Flint.file('npm/installer.js', function (require) {
    var tools = window._DT;

    Flint.view('Installer', function (view, on, $) {
      var version = '';
      var versions = [];
      var name = '';
      var error = '';
      var state = 0;

      tools.on('package:install', function () {
        view.set('state', state = 1);
        view.set('name', name = tools.data.name);
        view.update();
      });

      tools.on('package:installed', function () {
        view.set('state', state = 2);
        setTimeout(function () {
          view.set('state', state = 0);
          view.update();
        }, 2000);
        view.update();
      });

      tools.on('package:error', function () {
        view.set('state', state = 3);
        view.set('name', name = tools.data.name);
        view.set('error', error = tools.data.error);
        setTimeout(function () {
          view.set('state', state = 0);
          view.update();
        }, 2000);
        view.update();
      });

      tools.on('package:select', function () {
        view.set('state', state = 4);
        view.set('versions', versions = tools.data.versions);
        view.update();
      });

      var selectVersion = function selectVersion(v) {
        view.set('version', version = v);
        tools.data.version = v;
        tools.emitter.emit('package:select');
        view.set('state', state = 1);
        view.update();
      };

      var closeModal = function closeModal() {
        view.set('state', state = 0);
        view.update();
      };

      var title = function title(state) {
        switch (state) {
          case 1:
            return 'Installing ' + name + (version ? ' ' + version : '') + '...';
          case 2:
            return 'Installed ' + name + '!';
          case 3:
            return 'Error: ' + name;
          case 4:
            return 'Select version';
        }
      };

      var body = function body(state) {
        switch (state) {
          case 1:
            return null;
          case 2:
            return null;
          case 3:
            return error;
          case 4:
            return view.el(['Versions', 1], { versions: versions, onSelect: selectVersion });
        }
      }

      // was <modal but collided with bootstrap
      ;view.render(function () {
        return view.el(
          ['FlintModal', 1],
          {
            open: state > 0,
            onClose: closeModal,
            title: title(state),
            titleColor: state == 3 ? "#8c1919" : "#0f8c3c" },
          Flint.iff(false && state < 2) && view.el(['InstallerLoading', 1], { if: false && state < 2 }),
          body(state)
        );
      });
    });
    Flint.staticStyles('Versions', {
      '$version': '#_flintdevtools version.Versions, #_flintdevtools .Versions.version, #_flintdevtools .ViewVersions.version, #_flintdevtools .Versions > .version',
      '$inner': '#_flintdevtools inner.Versions, #_flintdevtools .Versions.inner, #_flintdevtools .ViewVersions.inner, #_flintdevtools .Versions > .inner',
      '$v': '#_flintdevtools v.Versions, #_flintdevtools .Versions.v, #_flintdevtools .ViewVersions.v, #_flintdevtools .Versions > .v',
      '$info': '#_flintdevtools info.Versions, #_flintdevtools .Versions.info, #_flintdevtools .ViewVersions.info, #_flintdevtools .Versions > .info'
    }, {
      '$version': {
        textAlign: 'left',
        padding: [2, 4],
        borderRadius: 2
      },
      '$inner': {
        flexFlow: 'row'
      },
      '$v': {
        flexGrow: 1,
        fontWeight: 'bold'

      },
      '$info': {}
    });
    Flint.view('Versions', function (view, on, $) {
      ;view.render(function () {
        return Flint.range(view.props.versions).map(function (_, _index) {
          return view.el(
            ['version', 1, _, _index],
            { repeat: view.props.versions, onClick: function () {
                return view.props.onSelect(_);
              } },
            view.el(
              ['inner', 1, _, _index],
              null,
              view.el(
                ['v', 1, _, _index],
                { key: 'v' + _index },
                _.version
              ),
              view.el(
                ['info', 1, _, _index],
                null,
                _.description
              ),
              view.el(
                ['a', 1, _, _index],
                { href: _.homepage, target: '_blank' },
                'Info'
              )
            )
          );
        });
      });

      $["v"] = function (_, _index) {
        return { ':hover': {
            background: '#fff',
            cursor: 'pointer'
          }
        };
      };
    });
  })
})();
//# sourceMappingURL=installer.js.map
