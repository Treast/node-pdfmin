#! /usr/bin/env node

import { join } from 'path';
import { checkArgs, checkCommand, runGhostScript, explore } from './lib/lib';

Promise.all([checkArgs(), checkCommand()])
  .then(async ([target, command]) => {
    const targetPath = join(process.cwd(), target);
    const files = explore(targetPath);

    for (let file of files) {
      await runGhostScript(command, file.toString());
    }

    console.log('\x1b[32m%s\x1b[0m', '✨ PDF has been compressed !');
  })
  .catch((err) => {
    console.error(`\x1b[31m${err}\x1b[0m`);
    process.exit(1);
  });
