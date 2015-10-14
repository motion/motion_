#!/usr/bin/env node

var Program = require('commander');

// make `flint run` default command
var flintCmdIndex;
process.argv.forEach(function(arg, i) {
  if (arg.match(/flint?$/)) flintCmdIndex = i;
});

// make sure flags are still passed to `flint run`
var firstFlag = process.argv[flintCmdIndex + 1]

if (flintCmdIndex === process.argv.length - 1 || (firstFlag && firstFlag[0] === '-')) {
  process.flintArgs = [].concat(process.argv);
  process.flintArgs.splice(flintCmdIndex + 1, 0, 'run');
}

Program
  .version(require('../../../package.json').version)
  .command('new [name] [template]', 'start a new Flint app')
  .command('run', 'run your flint app')
  .command('build', 'run your flint app');

Program.parse(process.flintArgs || process.argv);
