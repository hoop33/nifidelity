const { getBuckets, getFlows } = require("./registry");

module.exports = (opts) => {
  for (const bucket of getBuckets(opts.input)) {
    console.log(bucket);
    for (const flow of getFlows(bucket)) {
      console.log(flow);
    }
  }
};
