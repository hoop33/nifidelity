const fs = require("fs");

const { getBuckets, getFlows } = require("./registry");
const { validateBucket, validateFlow } = require("./rules");
const { createOutput } = require("./output");

const isBucketValid = (bucket, out) => {
  const validation = validateBucket(bucket);
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

const isFlowValid = (flow, out) => {
  const validation = validateFlow(flow);
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

    const mermaid = opts.mermaid ? fs.readFileSync(opts.mermaid, "utf8") : null;

    for (const bucket of getBuckets(opts.input)) {
      if (!isBucketValid(bucket, out)) hasErrors = true;
      const flowFiles = [];
      for (const flow of getFlows(bucket)) {
        if (!isFlowValid(flow, out)) hasErrors = true;
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
