#! /usr/bin/env node

/*
 * log-comments
 * https://github.com/mbitto/log-comments
 *
 * Copyright (c) 2013 Manuel Bitto
 * Licensed under the MIT license.
 */

/*global require, process, console*/

(function () {
    "use strict";

    var fs = require('fs'),
        myArgs = require('optimist').argv,
        directory = null,
        lines = null,
        fileNamePrepend = 'copy-of-',
        result = null,
        charsMapping = {l : 'log', w : 'warn', e : 'error'},
        parseFile = function (file, directory) {
            directory = directory || '';
            fs.readFile(directory + file, 'UTF8', function (err, fileContent) {
                if (err) {
                    throw err;
                }
                lines = fileContent.split('\n');
                lines.forEach(function (line, index, lines) {
                    var charPosition = line.search(/<-\{[l|w|e]{1}\}/);
                    if (charPosition >= 0) {
                        line = line.replace(/\/\/\s*/, 'console.' + charsMapping[line.charAt(charPosition + 3)] + '(\'');
                        line = line.replace(/\s*<-\{[l|w|e]{1}\}/, '\');');
                        lines[index] = line;
                    }
                });
                result = lines.join('\n');
                if (myArgs.i || myArgs['in-place']) {
                    fs.writeFile(directory + file, result, 'UTF8');
                } else {
                    fs.writeFile(directory + fileNamePrepend + file, result, 'UTF8');
                }
            });
        };

    if (myArgs.h || myArgs.help) {
        console.log('Options:\n' +
                '--in-place, -i: overwrite existing file with the new one\n' +
                '--directory, -d: specify a directory, all .js files inside directory will be parsed and elaborated\n' +
                '--help, -h: print help\n\n' +
                'Examples:\n' +
                'log-comments [OPTIONS] [FILE]');
        process.exit(0);
    }

    if (myArgs.d || myArgs.directory) {
        // Check dir contents
        directory = myArgs.d || myArgs.directory;
        if (directory.charAt(directory.length) !== '/') {
            directory = directory + '/';
        }
        fs.readdir(directory, function (err, files) {
            if (err) {
                throw err;
            }
            files.forEach(function (file) {
                parseFile(file, directory);
            });
        });
    } else {
        // Check Files
        myArgs._.forEach(function (file) {
            parseFile(file);
        });
    }
}());