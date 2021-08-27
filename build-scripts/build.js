'use strict'

const shell = require('shelljs')
const chalk = require('chalk')
const fs = require('fs')

const NPM_DIR = `dist`
const BANNER_CMD = `yarn banners`

shell.echo(`Start building...`)

shell.rm(`-Rf`, `${NPM_DIR}/*`)
shell.mkdir(`-p`, `./${NPM_DIR}`)

// Maintain banners
if (shell.exec(BANNER_CMD).code !== 0) {
  shell.echo(chalk.red(`Error: Maintain banners failed`))
  shell.exit(1)
}

shell.cp(`-Rf`, [`lib.*`, `package.json`, `LICENSE`, `*.md`], `${NPM_DIR}`)

shell.echo(`Modifying final package.json`)
const packageJSON = JSON.parse(fs.readFileSync(`./${NPM_DIR}/package.json`))
packageJSON.private = false;
packageJSON.scripts.prepare = '';

// Remove "dist/" from the entrypoint paths.
['main', 'module', 'types'].forEach(function (key) {
  if (packageJSON[key]) {
    packageJSON[key] = packageJSON[key].replace('dist/', '')
  }
})

fs.writeFileSync(`./${NPM_DIR}/package.json`, JSON.stringify(packageJSON, null, 4))

shell.echo(chalk.green(`End building`))
