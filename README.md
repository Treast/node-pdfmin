# pdfmin

![CI Status](https://github.com/Treast/node-pdfmin/actions/workflows/node.yml/badge.svg)

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

### Compress all PDF inside a folder

```shell
npx pdfmin ./myFolder/
```
