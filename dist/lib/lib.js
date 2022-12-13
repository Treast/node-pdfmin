"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGhostScript = exports.explore = exports.isDirectory = exports.checkCommand = exports.checkArgs = void 0;
const child_process_1 = require("child_process");
const command_exists_1 = require("command-exists");
const process_1 = require("process");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Check if path passed as argument is set
 * @returns Promise<string> Path
 */
const checkArgs = () => {
    return new Promise((resolve, reject) => {
        const target = process_1.argv[2];
        if (!target)
            reject('Please specify which file/folder you want to compress (npx pdfmin myFile.pdf).');
        resolve(target);
    });
};
exports.checkArgs = checkArgs;
/**
 * Check if Ghostscript is installed globally on device
 * @returns Promise<string> GhostScript command to use
 */
const checkCommand = () => {
    return new Promise((resolve, reject) => {
        const commands = ['gs', 'gswin32c', 'gswin64c', 'gsos2'];
        const availableCommands = commands.filter(command_exists_1.sync);
        if (!availableCommands[0])
            reject('Ghostscript is not installed on your device.');
        resolve(availableCommands[0]);
    });
};
exports.checkCommand = checkCommand;
/**
 * Check if a path is a directory
 * @param target Path to check
 * @returns boolean True if path is a directory
 */
const isDirectory = (target) => {
    return fs_1.statSync(target).isDirectory();
};
exports.isDirectory = isDirectory;
/**
 * Explore folders recursively for PDF file
 */
const explore = (target, files = []) => {
    if (!exports.isDirectory(target))
        return path_1.extname(target) === '.pdf' ? [...files, target] : files;
    // Loop for each file on directory
    return fs_1.readdirSync(target)
        .map((file) => {
        const filePath = path_1.join(target, file);
        return exports.explore(filePath, files);
    })
        .flat(2);
};
exports.explore = explore;
/**
 * Run the Ghostscript command
 * @param command Ghostcript command to use
 * @param file PDF File to compress
 * @returns Promise<boolean,string> True if Ghostcript has finished, error message otherwise
 */
const runGhostScript = (command, file) => {
    return new Promise((resolve, reject) => {
        const fileBasename = path_1.basename(file, path_1.extname(file));
        const fileDirname = path_1.dirname(file) + path_1.sep;
        const gs = child_process_1.spawn(command, [
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
exports.runGhostScript = runGhostScript;
