const { getBuckets, getFlows } = require("./registry");
const { validateBucket, validateFlow } = require("./rules");
const { createOutput } = require("./output");

const applyBucketRules = (bucket, out) => {
  const validation = validateBucket(bucket);
  if (validation.fails()) {
    out.writeErrors("Bucket", bucket.bucketId, validation.errors.all());
  }
};

const applyFlowRules = (flow, out) => {
  const validation = validateFlow(flow);
  if (validation.fails()) {
    out.writeErrors("Flow", flow.id, validation.errors.all());
  }
};

module.exports = (opts) => {
  try {
    const out = createOutput(opts.output, opts.overwrite);

    for (const bucket of getBuckets(opts.input)) {
      applyBucketRules(bucket, out);
      const flowFiles = [];
      for (const flow of getFlows(bucket)) {
        applyFlowRules(flow, out);
        const info = out.writeFlow(flow);
        info && flowFiles.push(info);
      }
      out.writeBucket(bucket, flowFiles);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
