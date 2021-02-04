const fs = require("fs");
const path = require("path");
let Validator = require("validatorjs");

const { getBuckets, getFlows } = require("./registry");
const { createOutput } = require("./output");
const { createFlowDocument } = require("./document");

const isBucketValid = (rules, bucket, out) => {
  if (!rules) return true;

  const validation = new Validator(bucket, rules);
  if (validation.fails()) {
    out.writeErrors(
      "Bucket",
      bucket.path,
      bucket.bucketId,
      validation.errors.all()
    );
    return false;
  }
  return true;
};

const validateFlow = (rules, flow, out) => {
  if (rules) {
    const validation = new Validator(flow, rules);
    if (validation.fails()) {
      out.writeErrors("Flow", flow.name, flow.id, validation.errors.all());
      return validation.errors.all();
    }
  }
};

module.exports = (opts) => {
  let hasErrors = false;

  try {
    const out = createOutput(opts.output, opts.overwrite);
    const rules = opts.rules
      ? JSON.parse(fs.readFileSync(opts.rules, "utf8"))
      : {};
    const mermaid = opts.mermaid ? fs.readFileSync(opts.mermaid, "utf8") : null;

    for (const bucket of getBuckets(opts.input)) {
      if (!isBucketValid(rules.bucket, bucket, out)) hasErrors = true;
      const flowFiles = [];
      for (const flow of getFlows(bucket)) {
        const errors = validateFlow(rules.flow, flow, out);
        if (errors) hasErrors = true;
        const document = createFlowDocument(flow, mermaid, errors);
        const fileName = `${flow.id}.md`;
        fs.writeFileSync(path.resolve(opts.output, fileName), document, "utf8");

        flowFiles.push({
          name: flow.name,
          errors: errors != null,
          fileName,
        });
      }
      out.writeBucket(bucket, flowFiles);
    }
    if (hasErrors) process.exitCode = 1;
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
};
