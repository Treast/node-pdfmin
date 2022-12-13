import { PathLike } from 'fs';
/**
 * Check if path passed as argument is set
 * @returns Promise<string> Path
 */
export declare const checkArgs: () => Promise<string>;
/**
 * Check if Ghostscript is installed globally on device
 * @returns Promise<string> GhostScript command to use
 */
export declare const checkCommand: () => Promise<string>;
/**
 * Check if a path is a directory
 * @param target Path to check
 * @returns boolean True if path is a directory
 */
export declare const isDirectory: (target: string) => boolean;
/**
 * Explore folders recursively for PDF file
 */
export declare const explore: (target: string, files?: PathLike[]) => PathLike[];
/**
 * Run the Ghostscript command
 * @param command Ghostcript command to use
 * @param file PDF File to compress
 * @returns Promise<boolean,string> True if Ghostcript has finished, error message otherwise
 */
export declare const runGhostScript: (command: string, file: string) => Promise<unknown>;
