let Validator = require("validatorjs");

const BUCKET_RULES = {
  bucketId: "required|alpha_dash",
  path: "required|string",
};

const FLOW_RULES = {
  id: "required|alpha_dash",
  name: "required|string|min:4",
  description: "required|string|min:6",
  comments: "required|string|min:6",
  version: "required|numeric",
  "contents.content.flowSnapshot.flowContents.comments":
    "required|string|min:6",
  "contents.content.flowSnapshot.flowContents.processors.*.comments":
    "required|string|min:6",
};

exports.validateBucket = (bucket) => new Validator(bucket, BUCKET_RULES);

exports.validateFlow = (flow) => new Validator(flow, FLOW_RULES);
