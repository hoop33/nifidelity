const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const BUCKET_FN = "bucket.yml";
const UNKNOWN = "(unknown)";

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
            name: dir.substring(dir.lastIndexOf("/") + 1),
            ...yaml.load(fs.readFileSync(path.join(dir, BUCKET_FN), "utf8")),
          };
        })
    : [];

exports.getFlows = (bucket) => {
  const flows = [];
  if (bucket && bucket.flows) {
    for (const key of Object.keys(bucket.flows)) {
      const flow = bucket.flows[key];
      const data = JSON.parse(
        fs.readFileSync(path.join(bucket.path, flow.file))
      );
      flows.push({
        id: key,
        name: flow.flowName || UNKNOWN,
        description: flow.flowDesc,
        comments: flow.comments,
        version: flow.ver,
        content: data && data.content ? data.content : {},
      });
    }
  }
  return flows;
};
