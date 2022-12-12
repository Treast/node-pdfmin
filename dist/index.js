"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
/**
 * Check if a path is a directory
 * @param target Path to check
 * @returns boolean True if path is a directory
 */
const isDirectory = (target) => {
    return fs_1.statSync(target).isDirectory();
};
/**
 * Deep explore folders for PDF file
 */
const explore = (target, files = []) => {
    if (!isDirectory(target))
        return path_1.extname(target) === '.pdf' ? [...files, target] : files;
    // Loop for each file on directory
    return fs_1.readdirSync(target)
        .map((file) => {
        const filePath = path_1.join(target, file);
        return explore(filePath, files);
    })
        .flat(2);
};
Promise.all([checkArgs(), checkCommand()])
    .then(([target, command]) => {
    const targetPath = path_1.join(process.cwd(), target);
    const files = explore(targetPath);
    console.log(files);
})
    .catch((err) => {
    throw new Error(err);
});
