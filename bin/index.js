#!/usr/bin/env node

const program = require("commander");
const pckg = require("./../package.json");
const run = require("./../lib/run");

program.version(pckg.version);

program.option("-i, --input <directory>", "input directory", ".");
program.option("-o, --output <directory>", "output directory", ".");
program.option(
  "-m, --mermaid <template_file>",
  "file containing mermaid template for flow diagrams (use CONTENTS in template for content placement)"
);
program.option("-r, --rules <rules_file>", "rules file in validatorjs format");
program.option(
  "-O, --overwrite",
  "overwrite files in the output directory",
  false
);

program.addHelpText(
  "after",
  `

Example rules file:
{
  "bucket": {
    "bucketId": "required|alpha_dash",
    "path": "required|string"
  },
  "flow": {
    "name": "required|string|min:4",
    "description": "required|string|min:6",
    "comments": "required|string|min:6",
    "content.flowSnapshot.flowContents.comments":
      "required|string|min:6",
  },
}

Example mermaid template file:
import Mermaid from '@theme/Mermaid';

<Mermaid chart={\`CONTENTS\`}/>
`
);

program.parse(process.argv);
run(program.opts());
