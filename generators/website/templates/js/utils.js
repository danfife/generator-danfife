const glob = require("glob")

exports.getFiles = function(globs = [], options) {
	const fileSet = new Set(),
				promises = []

	globs.forEach(fileGlob => {
		const promise = new Promise((resolve, reject) => {
			glob(fileGlob, options, (er, files) => {
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
