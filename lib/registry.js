const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const BUCKET_FN = "bucket.yml";

exports.getBuckets = (src) =>
  src
    ? fs
        .readdirSync(src, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => path.resolve(src, dirent.name))
        .filter((dir) => fs.existsSync(path.join(dir, BUCKET_FN)))
        .map((dir) => {
          return {
            path: dir,
            ...yaml.load(fs.readFileSync(path.join(dir, "bucket.yml"), "utf8")),
          };
        })
    : [];

exports.getFlows = (bucket) => {
  const flows = [];
  if (bucket && bucket.flows) {
    for (const key of Object.keys(bucket.flows)) {
      const flow = bucket.flows[key];
      flows.push({
        id: key,
        name: flow.flowName,
        description: flow.flowDesc,
        comments: flow.comments,
        version: flow.ver,
        file: flow.file,
      });
    }
  }
  return flows;
};
