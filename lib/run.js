const { getBuckets, getFlows } = require("./registry");
const { validateBucket, validateFlow } = require("./rules");
const { createOutput } = require("./output");

const isBucketValid = (bucket, out) => {
  const validation = validateBucket(bucket);
  if (validation.fails()) {
    out.writeErrors("Bucket", bucket.bucketId, validation.errors.all());
    return false;
  }
  return true;
};

const isFlowValid = (flow, out) => {
  const validation = validateFlow(flow);
  if (validation.fails()) {
    out.writeErrors("Flow", flow.id, validation.errors.all());
    return false;
  }
  return true;
};

module.exports = (opts) => {
  let hasErrors = false;

  try {
    const out = createOutput(opts.output, opts.overwrite);

    for (const bucket of getBuckets(opts.input)) {
      if (!isBucketValid(bucket, out)) hasErrors = true;
      const flowFiles = [];
      for (const flow of getFlows(bucket)) {
        if (!isFlowValid(flow, out)) hasErrors = true;
        const info = out.writeFlow(flow);
        info && flowFiles.push(info);
      }
      out.writeBucket(bucket, flowFiles);
    }
    if (hasErrors) process.exit(1);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
