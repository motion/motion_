import bridge from './bridge'
import server from './server'
import bundler from './bundler'
import builder from './builder'
import opts from './opts'
import disk from './disk'
import gulp from './gulp'
import cache from './cache'
import keys from './keys'
import watchDeletes from './lib/watchDeletes'
import { logError, handleError, path, log } from './lib/fns'
import Editor from './editor'

// welcome to motion!

let started = false

export async function startup(options = {}) {
  if (process.env.MOTION_DEBUG) {
    print('total startup time: ', Date.now() - process.env.startedat)
  }

  if (started) return
  started = true

  print()

  // order important!
  await opts.init(options)


  log.setLogging()
  await disk.init() // reads versions and sets up readers/writers
  await builder.clear.init() // ensures internal directories set up
  await Promise.all([
    opts.serialize(), // write out opts to state file
    cache.init(),
    bundler.init()
  ])

  watchDeletes()
}

async function gulpScripts(opts) {
  await gulp.init(opts)
  await gulp.afterBuild()
}

export async function build(opts = {}) {
  try {
    await startup({ ...opts, build: true })
    await Promise.all([
      bundler.remakeInstallDir(),
      builder.clear.buildDir()
    ])
    await Promise.all([
      gulp.assets(),
      gulpScripts({ once: opts.once })
    ])
    await bundler.all()
    await builder.build()
    if (opts.once) return
    print()
    process.exit()
  }
  catch(e) {
    handleError(e)
  }
}

export async function run(opts) {
  try {
    await startup(opts)
    if (opts.watch) gulp.assets()
    await server.run()
    await bridge.activate()
    activateEditor(bridge)
    await gulpScripts()
    cache.serialize() // write out cache
    await bundler.all()
    if (opts.watch) await builder.build()
    keys.init()
  }
  catch(e) {
    handleError(e)
  }
}

function activateEditor(bridge) {
  const editor = new Editor()
  editor.activate(bridge)
}
