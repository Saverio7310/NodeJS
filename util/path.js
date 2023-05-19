const path = require('path')

exports.getPath = (...routes) => {
    return path.join(path.dirname(require.main.filename), ...routes)
}