import path from 'path'
import log from './lib/log'
import { p, sanitize, handleError, readJSON, touch } from './lib/fns'
import disk from './disk'
import util from 'util'
// import webpack from 'webpack'
// import handleWebpackErrors from './bundler/lib/handleWebpackErrors'

let OPTS = {}

export async function init(cli) {
  // init
  OPTS.appDir = path.normalize(process.cwd())
  OPTS.name = opts.name || path.basename(process.cwd())
  OPTS.saneName = sanitize(opts.name)
  OPTS.hasRunInitialBuild = false
  OPTS.defaultPort = 4000

  setupDirs()

  OPTS.hasRunInitialBuild = false
  OPTS.defaultPort = 4000

  // config
  const config = await loadConfigs(cli)
  setupConfig(cli, config)
}

function readConfig() {
  return new Promise((resolve, reject) => {
    // touch(p(OPTS.flintDir, 'config.js'))

    // webpack({
    //   context: OPTS.flintDir,
    //   entry: './config.js',
    //   output: {
    //     filename: 'config.js',
    //     path: './internal'
    //   }
    //   // module: {
    //   //   loaders: [
    //   //     { test: /\.js$/, loader: babel }
    //   //   ]
    //   // }
    // }, (err, stats) => {
    //   handleWebpackErrors('externals', err, stats, resolve, reject)
    // })
  })
}

async function loadConfigs() {
  // await readConfig()
  return await flintConfig()
}

async function flintConfig() {
  try {
    const config = await readJSON(OPTS.configFile)
    return config[OPTS.build ? 'build' : 'run']
  }
  catch(e) {
    handleError({ message: `Error parsing config file: ${OPTS.configFile}` })
  }
}

function setupDirs() {
  // base dirs
  OPTS.flintDir = p(OPTS.appDir, '.flint')
  OPTS.modulesDir = p(OPTS.flintDir, 'node_modules')
  OPTS.internalDir = p(OPTS.flintDir, '.internal')
  OPTS.depsDir = p(OPTS.internalDir, 'deps')
  OPTS.template = OPTS.template || '.flint/index.html'
  OPTS.buildDir = OPTS.out ? p(OPTS.out) : p(OPTS.flintDir, 'build')

  // deps dirs
  OPTS.deps = {}
  OPTS.deps.dir = p(OPTS.internalDir, 'deps')
  OPTS.deps.assetsDir = p(OPTS.deps.dir, 'assets')
  OPTS.deps.internalsIn = p(OPTS.deps.dir, 'internals.in.js')
  OPTS.deps.internalsOut = p(OPTS.deps.dir, 'internals.js')
  OPTS.deps.externalsIn = p(OPTS.deps.dir, 'externals.in.js')
  OPTS.deps.externalsOut = p(OPTS.deps.dir, 'externals.js')
  OPTS.deps.externalsPaths = p(OPTS.deps.dir, 'externals.paths.js')

  OPTS.configFile = p(OPTS.flintDir, 'flint.json')
  OPTS.stateFile = p(OPTS.internalDir, 'state.json')
  // OPTS.outDir = p(OPTS.internalDir, '../../../built')
  OPTS.outDir = p(OPTS.internalDir, 'out')
  OPTS.styleDir = p(OPTS.internalDir, 'styles')
  OPTS.styleOutDir = p(OPTS.buildDir, '_', 'styles.css')
}

function setupConfig(cli, config) {
  OPTS.version = cli.version
  OPTS.debug = cli.debug
  OPTS.watch = cli.watch
  OPTS.reset = cli.reset
  OPTS.build = cli.build

  // config
  OPTS.config = Object.assign(
    {
      minify: true,
      debug: false,
    },
    config
  )

  // cli overrides config
  if (cli.nomin) OPTS.config.minify = false
  if (cli.pretty) OPTS.config.pretty = true
  if (cli.port) OPTS.config.port = cli.port
  if (cli.host) OPTS.config.host = cli.host
}

export function set(key, val) {
  log.opts('opts.set'.bold.yellow, key, val)
  OPTS[key] = val
  return val
}

export function get(key) {
  return key ? OPTS[key] : OPTS
}

export async function serialize() {
  await disk.state.write((state, write) => {
    state.opts = { ...OPTS }
    delete state.opts.state // prevent circular structure
    write(state)
  })
}

export function debug() {
  console.log(util.inspect(OPTS, false, 10))
}



// this is bit funky, but lets us do:
//   opts('dir') => path
//   opts.set('dir', 'other')

function opts(name) {
  return get(name)
}

opts.set = set
opts.init = init
opts.serialize = serialize
opts.debug = debug

export default opts
