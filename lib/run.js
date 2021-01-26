const { getBuckets } = require("./registry");

module.exports = (opts) => {
  const buckets = getBuckets(opts.input);
  console.log(buckets);
};
