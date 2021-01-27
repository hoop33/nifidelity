const { getBuckets, getFlows } = require("./registry");
const { validateBucket, validateFlow } = require("./rules");

const applyBucketRules = (bucket) => {
  const validation = validateBucket(bucket);
  if (validation.fails()) {
    // TODO put errors somewhere
  }
};

const applyFlowRules = (flow) => {
  const validation = validateFlow(flow);
  if (validation.fails()) {
    // TODO put errors somewhere
  }
};

module.exports = (opts) => {
  for (const bucket of getBuckets(opts.input)) {
    applyBucketRules(bucket);
    for (const flow of getFlows(bucket)) {
      applyFlowRules(flow);
    }
  }
};
