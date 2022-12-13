import { spawn } from 'child_process';
import { sync as commandExists } from 'command-exists';
import { argv } from 'process';
import { PathLike, statSync, readdirSync } from 'fs';
import { join, extname, basename, dirname, sep } from 'path';

/**
 * Check if path passed as argument is set
 * @returns Promise<string> Path
 */
export const checkArgs = (): Promise<string> => {
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
export const checkCommand = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const commands = ['gs', 'gswin32c', 'gswin64c', 'gsos2'];
    const availableCommands = commands.filter(commandExists);

    /* istanbul ignore next */
    if (!availableCommands[0]) reject('Ghostscript is not installed on your device.');

    resolve(availableCommands[0]);
  });
};

/**
 * Check if a path is a directory
 * @param target Path to check
 * @returns boolean True if path is a directory
 */
export const isDirectory = (target: string): boolean => {
  return statSync(target).isDirectory();
};

/**
 * Explore folders recursively for PDF file
 */
export const explore = (target: string, files: PathLike[] = []): PathLike[] => {
  /* istanbul ignore next */
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
export const runGhostScript = (command: string, file: string) => {
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

    gs.on('error', () => {
      reject('Error while using GhostScript CLI.');
    });

    gs.on('close', () => {
      resolve(true);
    });
  });
};
