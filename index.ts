import { join } from 'path';
import { checkArgs, checkCommand, runGhostScript, explore } from './lib/lib';

Promise.all([checkArgs(), checkCommand()])
  .then(async ([target, command]) => {
    const targetPath = join(process.cwd(), target);
    const files = explore(targetPath);

    for (let file of files) {
      await runGhostScript(command, file.toString());
    }

    console.log('✨ PDF has been compressed !');
  })
  .catch((err) => {
    throw new Error(err);
  });
