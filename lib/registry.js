const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const BUCKET_FN = "bucket.yml";

exports.getBuckets = (src) =>
  fs
    .readdirSync(src, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.resolve(src, dirent.name))
    .filter((dir) => fs.existsSync(path.join(dir, BUCKET_FN)))
    .map((dir) => {
      return {
        path: dir,
        ...yaml.load(fs.readFileSync(path.join(dir, "bucket.yml"), "utf8")),
      };
    });
