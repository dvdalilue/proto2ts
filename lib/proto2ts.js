#!/usr/bin/env node

var pegjs = require('pegjs');
var fs = require('fs');

const grammar = fs.readFileSync(__dirname + '/proto/grammar.pegjs').toString();
const parser = pegjs.generate(grammar);

var args = process.argv.slice(2);

if (args[0]) {
    const input = fs.readFileSync(process.cwd() + '/' + args[0]).toString();
    console.log(`Parsing....\n${JSON.stringify(parser.parse(input), null, 4)}`);
}

