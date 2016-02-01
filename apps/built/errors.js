(function () {
  Flint.file('errors.js', function (require) {
    var browser = window._DT;
    var split = function split(s, i) {
      return [s.substring(0, i), s.substring(i, i + 1), s.substring(i + 1)];
    };

    var isLive = function isLive() {
      return browser.editor && browser.editor.live;
    };

    // TODO make beautiful
    var CUR_ERROR = undefined;

    function showFlintErrorDiv() {
      setTimeout(function () {
        // avoid showing if error fixed in meantime
        if (!CUR_ERROR) return;

        var errors = document.querySelectorAll('.__flintError');
        if (!errors.length) return;
        // add active class to show them
        [].forEach.call(errors, function (error) {
          if (error.className.indexOf('active') == -1) error.className += ' active';
        });
      }, isLive() ? 1000 : 100);
    }

    function niceRuntimeError(err) {
      if (err.file) err.file = err.file.replace(new RegExp('.*' + window.location.origin + '(\/[_]+\/)?'), '');

      if (err.file && err.file.indexOf('internals.js') >= 0) {
        if (err.message && err.message.indexOf('Cannot find module') == 0) {
          var badModule = err.message.match(/(fs|path)/);

          if (badModule && badModule.length) {
            err.file = 'imported module:';
            err.message = 'Cannot import node-only module: ' + badModule[0];
          }
        } else {
          err.message = 'Error in a locally required file. ' + err.message;
        }
      }

      if (err.message) err.niceMessage = err.message.replace(/Uncaught .*Error:\s*/, '');

      return err;
    }

    function niceNpmError(_ref) {
      var msg = _ref.msg;
      var name = _ref.name;

      if (msg) msg = msg.replace(/(npm WARN.*\n|ERR\!)/g, '').replace(/npm  argv.*\n/g, '').replace(/npm  node v.*\n/g, '').replace(/npm  npm.*\n/g, '').replace(/npm  code.*\n/g, '').replace(/npm  peerinvalid /g, '').replace(/npm  404 /g, '');

      return { msg: msg, name: name };
    }

    var niceCompilerError = function niceCompilerError(err) {
      return niceCompilerMessage(fullStack(niceStack(err)));
    };

    var replaceCompilerMsg = function replaceCompilerMsg(msg) {
      if (!msg) return '';
      return msg.replace(/.*\.js\:/, '').replace(/\([0-9]+\:[0-9]+\)/, '').replace(/Line [0-9]+\:\s*/, '');
    };

    var niceCompilerMessage = function niceCompilerMessage(err) {
      err.niceMessage = replaceCompilerMsg(err.message, err.fileName);
      return err;
    };

    var matchErrorLine = /\>?\s*([0-9]*)\s*\|(.*)/g;
    var indicator = /\s*\|\s*\^\s*$/g;

    var fullStack = function fullStack(err) {
      if (!err) return;
      if (err.stack) {
        (function () {
          err.fullStack = ['', '', ''];
          var index = 0;
          err.stack.split("\n").forEach(function (line) {
            if (indicator.test(line)) return;
            if (!matchErrorLine.test(line)) return;
            var isLine = line[0] === '>';
            if (isLine) index = 1;
            if (!isLine && index === 1) index = 2;
            var result = line.replace(matchErrorLine, '$1$2').replace(/^(\s*[0-9]+\s*)[;]/, '$1 ');
            err.fullStack[index] += result + "\n";
          });
        })();
      }
      return err;
    };

    var niceStack = function niceStack(err) {
      if (!err) return;
      if (err.stack) {
        err.stack.split("\n").map(function (line) {
          if (line[0] === '>') {
            var result = line;
            if (!result) return;
            // remove the babel " > |" before the line
            result = result.replace(/\>\s*[0-9]+\s*\|\s*/, '');
            result = replaceCompilerMsg(result);
            var colIndex = err.loc.column - 4; // 4 because we remove babel prefix
            err.niceStack = split(result, colIndex);
          }
        });
      }
      return err;
    };

    var log = function log() {
      if (false) console.log.apply(console, arguments);
    };

    Flint.view('Errors', function (view, on, $) {
      view.pause();

      var error = null;
      var compileError = null;
      var runtimeError = null;
      var npmError = null;

      /* only set error if there is an error,
         giving compile priority */
      function setError() {
        if (compileError) view.set('error', error = niceCompilerError(compileError));else if (runtimeError) view.set('error', error = niceRuntimeError(runtimeError));else {
          view.set('error', error = null);
        }

        CUR_ERROR = error;

        log('tools: view.update()');
        view.update();
        view.update();
      }

      function close() {
        view.set('error', error = null);
        view.set('compileError', compileError = null);
        view.set('runtimeError', runtimeError = null);
        view.set('npmError', npmError = null);
        view.update();
        view.update();
      }

      browser.on('compile:error', function () {
        log('compile:error');
        view.set('compileError', compileError = browser.data.error);
        setError();
        view.update();
      });

      browser.on('runtime:error', function () {
        // if (runtimeError) return // prefer first error
        view.set('runtimeError', runtimeError = browser.data);
        log('runtime:error', runtimeError);
        setError();
        view.update();
      });

      browser.on('npm:error', function () {
        view.set('npmError', npmError = niceNpmError(browser.data.error));
        log('npm:error', npmError);
        view.update();
        view.update();
      });

      browser.on('runtime:success', function () {
        log('runtime:success');
        view.set('runtimeError', runtimeError = null);
        view.set('npmError', npmError = null);
        setError();
        view.update();
      });

      browser.on('compile:success', function () {
        log('compile:success');
        view.set('compileError', compileError = null);
        view.set('npmError', npmError = null);
        setError();
        view.update();
      });view.render(function () {
        return view.el(['ErrorMessage', 1], {
          error: error,
          npmError: npmError,
          close: close
        });
      });
    });

    var flintAddedLines = 0;
    var last = function last(arr) {
      return arr[arr.length - 1];
    };
    var fileName = function fileName(url) {
      return url && url.replace(/[\?\)].*/, '');
    };
    var getLine = function getLine(err) {
      return err && (err.line || err.loc && err.loc.line);
    };

    Flint.staticStyles('ErrorMessage', {
      '$bar': '#_flintdevtools bar.ErrorMessage, #_flintdevtools .ErrorMessage.bar, #_flintdevtools .ViewErrorMessage.bar, #_flintdevtools .ErrorMessage > .bar',
      '$inner': '#_flintdevtools inner.ErrorMessage, #_flintdevtools .ErrorMessage.inner, #_flintdevtools .ViewErrorMessage.inner, #_flintdevtools .ErrorMessage > .inner',
      '$top': '#_flintdevtools top.ErrorMessage, #_flintdevtools .ErrorMessage.top, #_flintdevtools .ViewErrorMessage.top, #_flintdevtools .ErrorMessage > .top',
      '$where': '#_flintdevtools where.ErrorMessage, #_flintdevtools .ErrorMessage.where, #_flintdevtools .ViewErrorMessage.where, #_flintdevtools .ErrorMessage > .where',
      '$line': '#_flintdevtools line.ErrorMessage, #_flintdevtools .ErrorMessage.line, #_flintdevtools .ViewErrorMessage.line, #_flintdevtools .ErrorMessage > .line',
      '$flint': '#_flintdevtools flint.ErrorMessage, #_flintdevtools .ErrorMessage.flint, #_flintdevtools .ViewErrorMessage.flint, #_flintdevtools .ErrorMessage > .flint',
      '$shortError': '#_flintdevtools shortError.ErrorMessage, #_flintdevtools .ErrorMessage.shortError, #_flintdevtools .ViewErrorMessage.shortError, #_flintdevtools .ErrorMessage > .shortError',
      '$cur': '#_flintdevtools cur.ErrorMessage, #_flintdevtools .ErrorMessage.cur, #_flintdevtools .ViewErrorMessage.cur, #_flintdevtools .ErrorMessage > .cur',
      '$errCol': '#_flintdevtools errCol.ErrorMessage, #_flintdevtools .ErrorMessage.errCol, #_flintdevtools .ViewErrorMessage.errCol, #_flintdevtools .ErrorMessage > .errCol',
      '$ln': '#_flintdevtools ln.ErrorMessage, #_flintdevtools .ErrorMessage.ln, #_flintdevtools .ViewErrorMessage.ln, #_flintdevtools .ErrorMessage > .ln',
      '$flintline': '#_flintdevtools flintline.ErrorMessage, #_flintdevtools .ErrorMessage.flintline, #_flintdevtools .ViewErrorMessage.flintline, #_flintdevtools .ErrorMessage > .flintline'
    }, {
      '$bar': {
        display: 'block',

        position: 'fixed',
        left: 0,

        transition: 'all 200ms ease-in',
        right: 0,
        fontFamily: '-apple-system, "San Francisco", Roboto, "Segou UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 300,
        color: '#fff',
        fontSize: '14px',
        padding: 2,
        pointerEvents: 'all',
        overflow: 'scroll',
        zIndex: 2147483647,
        boxShadow: '0 -6px 12px rgba(0,0,0,0.06)'
      },
      '$inner': {
        display: 'block',
        maxHeight: 200,
        overflowY: 'scroll'
      },
      '$top': {
        padding: 8,
        display: 'block'
      },
      '$where': {
        display: 'inline-block',
        pointerEvents: 'all',
        fontWeight: 300,
        color: 'rgba(255,255,255,0.8)'
      },
      '$line': {
        display: 'inline-block',
        whiteSpace: 'pre',
        pointerEvents: 'all'
      },
      '$flint': {
        display: 'inline',
        fontWeight: 700,
        color: '#fff'
      },
      '$shortError': {
        display: 'inline',
        color: 'rgba(255,255,255,0.7)'
      },
      '$cur': {
        background: '#fff'
      },
      '$errCol': {
        display: 'inline',
        borderBottom: '2px solid #f5d64c',
        margin: -3,
        padding: 3,
        color: '#fff'
      },
      '$ln': {
        padding: [0, 20]
      },
      '$flintline': {
        whiteSpace: 'pre',
        pointerEvents: 'all',
        fontWeight: 'flint'
      }
    });
    Flint.view('ErrorMessage', function (view, on, $) {
      view.pause();

      var hasError = false;
      var error = {};
      var npmError = undefined,
          fullStack = undefined;
      var line = getLine(view.props.error);
      var clearDelay = undefined;

      on.props(function () {
        clearDelay && clearDelay();

        view.set('npmError', npmError = view.props.npmError);
        view.set('hasError', hasError = !!(view.props.error || view.props.npmError));
        view.set('error', error = view.props.error || error); // keep old
        view.set('line', line = getLine(error));
        view.set('fullStack', fullStack = null);

        view.update();

        // show full stack after a delay
        if (error) {
          view.set('clearDelay', clearDelay = on.delay(2500, function () {
            if (hasError && error.fullStack) {
              view.set('fullStack', fullStack = error.fullStack);
              view.update();
            }
          }));
        }
        view.update();
      });

      // update on editor state
      browser.emitter.on('editor:state', function () {
        return setTimeout(view.update);
      });view.render(function () {
        return view.el(
          ['Debounce', 1],
          {
            // delay more during live typing
            delay: isLive() ? 2000 : 1000,
            force: hasError === false,
            showKey: fullStack || error && error.message,
            onUpdate: showFlintErrorDiv
          },
          view.el(
            ['bar', 1],
            null,
            view.el(['Close', 1], { onClick: view.props.close, size: 35 }),
            Flint.iff(npmError) && view.el(
              ['inner', 1],
              { if: npmError },
              view.el(
                ['where', 1],
                null,
                view.el(
                  ['flint', 1],
                  null,
                  npmError.name
                )
              ),
              ' ',
              npmError.msg
            ),
            view.el(
              ['inner', 2],
              null,
              view.el(
                ['top', 1],
                null,
                view.el(
                  ['where', 2],
                  null,
                  view.el(
                    ['span', 1],
                    null,
                    'In ',
                    view.el(
                      ['flint', 2],
                      null,
                      fileName(error.file)
                    )
                  ),
                  view.el(
                    ['line', 1],
                    null,
                    line ? ' line' : '',
                    ' ',
                    Flint.iff(line) && view.el(
                      ['flint', 3],
                      { if: line },
                      line - flintAddedLines
                    )
                  )
                ),
                ' ',
                view.el(
                  ['shortError', 1],
                  null,
                  (error.niceMessage || error.message || '').trim(),
                  Flint.iff(error.niceStack) && view.el(
                    ['niceStack', 1],
                    { if: error.niceStack },
                    error.niceStack[0],
                    view.el(
                      ['errCol', 1],
                      null,
                      error.niceStack[1]
                    ),
                    error.niceStack[2]
                  )
                ),
                Flint.iff(error.help) && view.el(
                  ['help', 1],
                  { if: error.help },
                  error.help
                )
              ),
              Flint.iff(fullStack) && view.el(
                ['fullStack', 1],
                { if: fullStack },
                view.el(
                  ['ln', 1],
                  null,
                  '' + fullStack[0]
                ),
                view.el(
                  ['ln', 2],
                  { className: 'cur' },
                  '' + fullStack[1]
                ),
                view.el(
                  ['ln', 3],
                  null,
                  '' + fullStack[2]
                )
              )
            )
          )
        );
      });

      var red = '#cd423e';

      $["bar"] = function (_, _index) {
        return { background: red, bottom: hasError ? 0 : -100 };
      };

      var stack = {
        color: 'rgba(255,255,255,0.85)',
        display: 'inline',
        fontFamily: 'Meslo, Menlo, Monaco, monospace',
        padding: [0, 5]
      };

      $["niceStack"] = function (_, _index) {
        return stack;
      };

      $["fullStack"] = function (_, _index) {
        return [stack, {
          maxHeight: fullStack ? 600 : 0,
          padding: fullStack ? [10, 0] : 0,
          transition: 'maxHeight ease-in 300ms',
          color: 'rgba(0,0,0,0.85)',
          background: 'rgba(255,255,255,0.9)',
          display: 'block',
          whiteSpace: 'pre',
          fontSize: 14,
          borderRadius: 3,
          margin: 2
        }];
      };
    });
    Flint.staticStyles('ErrorIcon', {
      '$svg': '#_flintdevtools svg.ErrorIcon, #_flintdevtools .ErrorIcon.svg, #_flintdevtools .ViewErrorIcon.svg, #_flintdevtools .ErrorIcon > .svg'
    }, {
      '$svg': {
        width: 19,
        fill: 'red',
        margin: -4,
        marginLeft: 3,
        marginRight: 6,
        opacity: 0.9
      }
    });
    Flint.view('ErrorIcon', function (view, on, $) {
      ;view.render(function () {
        return view.el(
          ['svg', 1],
          { viewBox: '0 0 27.963 27.963' },
          view.el(['path', 1], { d: 'M13.983,0C6.261,0,0.001,6.259,0.001,13.979c0,7.724,6.26,13.984,13.982,13.984s13.98-6.261,13.98-13.984 C27.963,6.259,21.705,0,13.983,0z M13.983,26.531c-6.933,0-12.55-5.62-12.55-12.553c0-6.93,5.617-12.548,12.55-12.548 c6.931,0,12.549,5.618,12.549,12.548C26.531,20.911,20.913,26.531,13.983,26.531z' }),
          view.el(['polygon', 1], { points: '15.579,17.158 16.191,4.579 11.804,4.579 12.414,17.158' }),
          view.el(['path', 2], { d: 'M13.998,18.546c-1.471,0-2.5,1.029-2.5,2.526c0,1.443,0.999,2.528,2.444,2.528h0.056c1.499,0,2.469-1.085,2.469-2.528 C16.441,19.575,15.468,18.546,13.998,18.546z' })
        );
      });
    });
  })
})();
//# sourceMappingURL=errors.js.map
