const fs = require("fs");
let Validator = require("validatorjs");

const { getBuckets, getFlows } = require("./registry");
const { createOutput } = require("./output");

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

const isFlowValid = (rules, flow, out) => {
  if (!rules) return true;

  const validation = new Validator(flow, rules);
  if (validation.fails()) {
    out.writeErrors("Flow", flow.name, flow.id, validation.errors.all());
    return false;
  }
  return true;
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
        if (!isFlowValid(rules.flow, flow, out)) hasErrors = true;
        const info = out.writeFlow(flow, mermaid);
        info && flowFiles.push(info);
      }
      out.writeBucket(bucket, flowFiles);
    }
    if (hasErrors) process.exitCode = 1;
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
};
