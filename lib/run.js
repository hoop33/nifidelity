const { getBuckets, getFlows } = require("./registry");
const { validateBucket } = require("./rules");

const applyBucketRules = (bucket) => {
  const validation = validateBucket(bucket);
  if (validation.fails()) {
    // TODO put errors somewhere
  }
};

module.exports = (opts) => {
  for (const bucket of getBuckets(opts.input)) {
    applyBucketRules(bucket);
    for (const flow of getFlows(bucket)) {
      console.log(flow);
    }
  }
};
