#!/usr/bin/env node

const program = require("commander");
const pckg = require("./../package.json");
const run = require("./../lib/run");

program.version(pckg.version);

program.option("-i, --input <directory>", "input directory", ".");
program.option("-o, --output <directory>", "output directory", ".");
program.option(
  "-O, --overwrite",
  "overwrite files in the output directory",
  false
);

program.parse(process.argv);
run(program.opts());
