#!/usr/bin/env node
const { join, isAbsolute } = require('path');

const yParser = require('yargs-parser');

const start = require('../');

async function bootstrap() {
  const argv = yParser(process.argv.slice(2));


  let cwd = process.cwd();
  if (argv._[0]) {
    cwd = isAbsolute(argv._[0]) ? argv._[0] : join(process.cwd(), argv._[0]);
  }

  start({
    cwd,
    packages: argv.packages ? argv.packages.split(',') : [],
    command: argv.command || 'tnpm sync',
    timeout: argv.timeout || 20000,
  });
}

bootstrap();
