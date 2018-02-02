const ArgumentParser = require('argparse').ArgumentParser
const Version = require("node-version-assets")
const glob = require("glob")
const _ = require("lodash")

// Setup arguments
const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Assets'
})
parser.addArgument([ '-p', '--path' ], {
  help: 'the relative path from the cwd'
})
parser.addArgument([ '-u', '--cdnUrl' ], {
  help: 'the cdn url to append while rewriting files'
})
parser.addArgument([ '-s', '--silence' ], {
  help: 'the cdn url to append while rewriting files',
  action: 'storeTrue'
})
parser.addArgument([ '-f', '--hash' ], {
  help: 'the files to hash'
})
parser.addArgument([ '-r', '--rewrite' ], {
  help: 'the files to rewrite matching files with their hashed filenames'
})

// Parse arguments
const args = parser.parseArgs(),
			{path: relativePath, cdnUrl: cdnUrlPath, silence} = args,
			hashedFileGlobs = args.hash.split(' '),
			rewriteFileGlobs = args.rewrite.split(' ')

// Change working directory
if (relativePath) {
	process.chdir(`${process.cwd()}/${relativePath}`);
}

function getFiles(fileGlobs) {
	const fileSet = new Set(),
				promises = []

	fileGlobs.forEach(fileGlob => {
		const promise = new Promise((resolve, reject) => {
			glob(fileGlob, (er, files) => {
				if (er) {
					reject(er)
					return
				}
				files.forEach(file => fileSet.add(file))
				resolve()
			})
		})

		promises.push(promise)
	})

	return new Promise((resolve, reject) =>
			Promise.all(promises)
					.then(() => resolve(Array.from(fileSet)))
					.catch(error => reject(error))
	)
}

Promise.all([getFiles(hashedFileGlobs), getFiles(rewriteFileGlobs)]).then(data => {
	const [hashedFiles, rewriteFiles] = data,
		  	hashAndRewriteFiles = _.intersection(hashedFiles, rewriteFiles),
		  	hashOnlyFiles = _.difference(hashedFiles, hashAndRewriteFiles),
		  	rewriteOnlyFiles = _.difference(rewriteFiles, hashAndRewriteFiles)

	new Version({
		assets: hashOnlyFiles,
		grepFiles: rewriteFiles,
		cdnPath: cdnUrlPath,
		silence: silence
	}).run(function() {
		new Version({
			assets: hashAndRewriteFiles,
			grepFiles: rewriteOnlyFiles,
			cdnPath: cdnUrlPath,
			silence: silence
		}).run()	
	})
})


