const {spawnSync} = require('child_process')

const CWD = process.cwd()

function grepForFileMatches(str) {
  const grepSpawn = spawnSync(
    'grep',
    ['-w', str, '-lr', '--exclude-dir=.git', '--include=*.js', '.'],
    {
      cwd: CWD,
      encoding: 'utf8',
    },
  )

  if (grepSpawn.status === 2) {
    console.error(grepSpawn.stderr)
    process.exit(grepSpawn.status)
  }

  const files = grepSpawn.stdout
    .trim()
    .split('\n')
    .filter(file => !file.includes('Libraries/Renderer'))
    .map(file => file.replace('./', ''))

  return files
}

module.exports = {
  grepForFileMatches,
}
