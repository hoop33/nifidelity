let Validator = require("validatorjs");

const BUCKET_RULES = {
  bucketId: "required|alpha_dash",
  path: "required|string",
};

exports.validateBucket = (bucket) => new Validator(bucket, BUCKET_RULES);
