import gutil from 'gulp-util'
import through from 'through2'
import applySourceMap from 'vinyl-sourcemaps-apply'
import replaceExt from 'replace-ext'
import { babel } from '../../lib/requires'

import onMeta from './onMeta'
import writeStyle from '../../lib/writeStyle'
import { getBabelConfig } from '../../helpers'
import { log } from '../../lib/fns'

module.exports = function (opts) {
	opts = opts || {}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file)
			return
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-babel', 'Streaming not supported'))
			return
		}

		try {
			// TODO use
			let meta = {}

			const onImports = imports => meta.imports = imports
			const onExports = exports => meta.exports = exports

			let flintBabel = getBabelConfig({
				log,
				onMeta,
				writeStyle,
				onImports,
				onExports
			})

			var fileOpts = Object.assign({}, opts, {
				filename: file.path,
				filenameRelative: file.relative,
				sourceMap: Boolean(file.sourceMap)
			})

			var res = babel().transform(file.contents.toString(), fileOpts)

			console.log('md', res.metadata)
			console.log('meta', meta)

			if (file.sourceMap && res.map) {
				res.map.file = replaceExt(res.map.file, '.js')
				applySourceMap(file, res.map)
			}

			file.contents = new Buffer(res.code)
			file.path = replaceExt(file.path, '.js')
			file.babel = res.metadata

			this.push(file)
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-babel', err, {
				fileName: file.path,
				showProperties: false
			}))
		}

		cb()
	});
};
