#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const lib_1 = require("./lib/lib");
Promise.all([(0, lib_1.checkArgs)(), (0, lib_1.checkCommand)()])
    .then(([target, command]) => __awaiter(void 0, void 0, void 0, function* () {
    const targetPath = (0, path_1.join)(process.cwd(), target);
    const files = (0, lib_1.explore)(targetPath);
    for (let file of files) {
        yield (0, lib_1.runGhostScript)(command, file.toString());
    }
    console.log('\x1b[32m%s\x1b[0m', '✨ PDF has been compressed !');
}))
    .catch((err) => {
    console.error(`\x1b[31m${err}\x1b[0m`);
    process.exit(1);
});
