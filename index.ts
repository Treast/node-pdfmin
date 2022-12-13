import { spawn } from 'child_process';
import { sync as commandExists } from 'command-exists';
import { argv } from 'process';
import { PathLike, statSync, readdirSync } from 'fs';
import { join, extname, basename, dirname, sep } from 'path';

/**
 * Check if path passed as argument is set
 * @returns Promise<string> Path
 */
const checkArgs = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const target = argv[2];
    if (!target) reject('Please specify which file/folder you want to compress (npx pdfmin myFile.pdf).');

    resolve(target);
  });
};

/**
 * Check if Ghostscript is installed globally on device
 * @returns Promise<string> GhostScript command to use
 */
const checkCommand = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const commands = ['gs', 'gswin32c', 'gswin64c', 'gsos2'];
    const availableCommands = commands.filter(commandExists);

    if (!availableCommands[0]) reject('Ghostscript is not installed on your device.');

    resolve(availableCommands[0]);
  });
};

/**
 * Check if a path is a directory
 * @param target Path to check
 * @returns boolean True if path is a directory
 */
const isDirectory = (target: string): boolean => {
  return statSync(target).isDirectory();
};

/**
 * Explore folders recursively for PDF file
 */
const explore = (target: string, files: PathLike[] = []): PathLike[] => {
  if (!isDirectory(target)) return extname(target) === '.pdf' ? [...files, target] : files;

  // Loop for each file on directory
  return readdirSync(target)
    .map((file) => {
      const filePath = join(target, file);
      return explore(filePath, files);
    })
    .flat(2);
};

/**
 * Run the Ghostscript command
 * @param command Ghostcript command to use
 * @param file PDF File to compress
 * @returns Promise<boolean,string> True if Ghostcript has finished, error message otherwise
 */
const runGhostScript = (command: string, file: string) => {
  return new Promise((resolve, reject) => {
    const fileBasename = basename(file, extname(file));
    const fileDirname = dirname(file) + sep;

    const gs = spawn(command, [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      '-dPDFSETTINGS=/screen',
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${fileDirname}${fileBasename}_compressed.pdf`,
      file,
    ]);

    gs.stderr.on('data', (data) => {
      reject(data);
    });

    gs.on('close', () => {
      resolve(true);
    });
  });
};

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
