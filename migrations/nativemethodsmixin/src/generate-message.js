// @format

const {spawnSync} = require('child_process')
const babylon = require('@babel/parser')
const traverse = require('@babel/traverse')
const path = require('path')
const fs = require('fs')

const GrepForFileMatches = require('./grep-for-file-matches.js')
const ParseFile = require('./parse-file.js')

const CWD = process.cwd()
const {
  SHEPHERD_GITHUB_REPO_OWNER,
  SHEPHERD_GITHUB_REPO_NAME,
  SHEPHERD_GIT_REVISION,
} = process.env

if (
  SHEPHERD_GITHUB_REPO_OWNER == null ||
  SHEPHERD_GITHUB_REPO_NAME == null ||
  SHEPHERD_GIT_REVISION == null
) {
  throw new Error('Expected to find Shepherd environment variables')
}

const filesWithNativeMethodsMixin = GrepForFileMatches.grepForFileMatches(
  'NativeMethodsMixin',
)

const nativeMethodMixinPermalinks = new Set()

filesWithNativeMethodsMixin.forEach(relativePath => {
  const absolutePath = path.join(CWD, relativePath)
  const fileSource = fs.readFileSync(absolutePath, 'utf8')
  const ast = ParseFile.parseFile(fileSource, absolutePath)

  traverse.default(ast, {
    Identifier(nodePath) {
      const line = nodePath.node.loc.start.line

      if (nodePath.node.name === 'NativeMethodsMixin') {
        const parentArrayExpression = nodePath.findParent(path =>
          path.isArrayExpression(),
        )

        if (parentArrayExpression) {
          nativeMethodMixinPermalinks.add(
            `https://github.com/${SHEPHERD_GITHUB_REPO_OWNER}/${SHEPHERD_GITHUB_REPO_NAME}/blob/${SHEPHERD_GIT_REVISION}/${relativePath}#L${line}`,
          )
        }
      }
    },
  })
})

const filesWithNativeComponent = GrepForFileMatches.grepForFileMatches(
  'NativeComponent',
)

const extendingNativeComponentPermalinks = new Set()
const usingNativeComponentTypePermalinks = new Set()

filesWithNativeComponent.forEach(relativePath => {
  const absolutePath = path.join(CWD, relativePath)
  const fileSource = fs.readFileSync(absolutePath, 'utf8')
  const ast = ParseFile.parseFile(fileSource, absolutePath)

  traverse.default(ast, {
    Identifier(nodePath) {
      const line = nodePath.node.loc.start.line
      if (nodePath.node.name === 'NativeComponent') {
        const parentClassDeclaration = nodePath.findParent(path =>
          path.isClassDeclaration(),
        )

        if (parentClassDeclaration) {
          const superClass = parentClassDeclaration.node.superClass

          const superClassParent = nodePath.find(path => {
            return path.node === superClass
          })

          if (superClassParent) {
            // matches `extends NativeComponent`

            extendingNativeComponentPermalinks.add(
              `https://github.com/${SHEPHERD_GITHUB_REPO_OWNER}/${SHEPHERD_GITHUB_REPO_NAME}/blob/${SHEPHERD_GIT_REVISION}/${relativePath}#L${line}`,
            )
          } else {
            const parentTypeAnnotation = nodePath.findParent(path =>
              path.isGenericTypeAnnotation(),
            )

            if (parentTypeAnnotation) {
              usingNativeComponentTypePermalinks.add(
                `https://github.com/${SHEPHERD_GITHUB_REPO_OWNER}/${SHEPHERD_GITHUB_REPO_NAME}/blob/${SHEPHERD_GIT_REVISION}/${relativePath}#L${line}`,
              )
            }
          }
        }
      }
    },
  })
})

console.log('# Migrating components using NativeMethodsMixin')
Array.from(nativeMethodMixinPermalinks).forEach(permalink => {
  console.log(permalink)
})

console.log()
console.log('# Migrating Components extending NativeComponent')
Array.from(extendingNativeComponentPermalinks).forEach(permalink => {
  console.log(permalink)
})

console.log()
console.log('# Migrating Components using NativeComponent as a type')
Array.from(usingNativeComponentTypePermalinks).forEach(permalink => {
  console.log(permalink)
})

/*
- [ ] Libraries/Components/TextInput/TextInput.js#L830
https://github.com/react-native-community/react-native-tvos/blob/af86614177237ef2862808bcd2d68930f8556d11/Libraries/Components/TextInput/TextInput.js#L830
*/
