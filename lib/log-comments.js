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
        file = require('file'),
        myArgs = require('optimist').argv,
        lines = null,
        fileNamePrepend = '__',
        result = null,
        charsMapping = {l : 'log', w : 'warn', e : 'error'},
        isJS = function(fileName){
            return fileName.indexOf('.js', fileName.length - 3) !== -1;
        },
        isAlreadyParsed = function(fileName){
            return fileName.slice(0, 2) === '__';
        },
        parseFile = function (file) {
            var splittedPath = file.split('/'),
                fileName = splittedPath.pop();

            if(isJS(file) && !isAlreadyParsed(fileName)){
                console.log(file);
                fs.readFile(file, 'UTF8', function (err, fileContent) {
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
                        fs.writeFile(file, result, 'UTF8');
                    } else {
                        var newPath = splittedPath.join('/') + '/' + fileNamePrepend + fileName;
                        fs.writeFile(newPath, result, 'UTF8');
                    }
                });
            }
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
        var directory = myArgs.d || myArgs.directory;
        if (directory.charAt(directory.length) !== '/') {
            directory = directory + '/';
        }

        file.walk(directory, function(a, b, c, files){
            files.forEach(function (file) {
                parseFile(file);
            });
        });

    } else {
        // Check Files
        myArgs._.forEach(function (file) {
            parseFile(file);
        });
    }
}());