# pdfmin

![CI Status](https://github.com/Treast/node-pdfmin/actions/workflows/node.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/Treast/node-pdfmin/badge.svg?branch=main)](https://coveralls.io/github/Treast/node-pdfmin?branch=main)

**pdfmin** is a CLI tool to compress PDF using GhostScript.

## Requirements

GhostScript **must** be installed on your device !

### Install GhostScript on UNIX

```shell
sudo apt-get install -y ghostscript
```

### Install GhostScript on Windows

Go to [https://ghostscript.com/releases/gsdnld.html](https://ghostscript.com/releases/gsdnld.html) and download the installer corresponding to your Windows version.

Install GhostScript using the installer.

## Usage

### Compress only one PDF

```shell
npx pdfmin ./myFile.pdf
```

### Compress multiple specific PDF

```shell
npx pdfmin ./myFile.pdf ./myFile2.pdf
```

### Compress all PDF in a folder

```shell
npx pdfmin ./myFolder/
```

### Compress all PDF in multiple folders

```shell
npx pdfmin ./myFolder/ ./myFolder2/
```
