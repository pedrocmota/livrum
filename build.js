const fs = require('fs')
const fsExtra = require('fs-extra')
const copyNodeModules = require('copy-node-modules')
const package = require('./package.json')

const envFile = 'build/.env.example'
const nextFile = 'build/next.config.js'
const serverFile = 'build/server.js'
const yarnLock = 'build/yarn.lock'
const packageFile = 'build/package.json'
const publicFolder = 'build/public'
const certificatesFolder = 'build/certificates'

fs.copyFileSync('.env.example', envFile)
fs.copyFileSync('next.config.js', nextFile)
fs.copyFileSync('server.js', serverFile)
fs.copyFileSync('yarn.lock', yarnLock)

package.main = 'server.js'
package.scripts = {
  start: 'node server.js'
}
delete package.devDependencies
fs.writeFileSync(packageFile, JSON.stringify(package, null, 2))

fsExtra.copySync('public', publicFolder)
fsExtra.copySync('certificates', certificatesFolder)

copyNodeModules('./', './build', {devDependencies: false}, (err) => {
  if (err) {
    return console.error(err)
  }
})