const babylon = require('@babel/parser')

const PARSER_PLUGINS = [
  'jsx',
  'classProperties',
  'objectRestSpread',
  'dynamicImport',
  'nullishCoalescingOperator',
  'optionalChaining',
  'optionalCatchBinding',
]

function parseWithPlugins(fileSource, absolutePath, plugins) {
  return babylon.parse(fileSource, {
    sourceType: 'module',
    sourceFilename: absolutePath,
    plugins: plugins,
  })
}

function parseFile(fileSource, absolutePath) {
  try {
    return parseWithPlugins(fileSource, absolutePath, PARSER_PLUGINS)
  } catch (err) {
    try {
      return parseWithPlugins(
        fileSource,
        absolutePath,
        PARSER_PLUGINS.concat(['typescript']),
      )
    } catch (err) {
      try {
        return parseWithPlugins(
          fileSource,
          absolutePath,
          PARSER_PLUGINS.concat(['flow']),
        )
      } catch (err) {
        throw new Error(
          `Cannot parse ${absolutePath} ${err.message} - ${err.stack}`,
        )
      }
    }
  }
}

module.exports = {
  parseFile,
}
