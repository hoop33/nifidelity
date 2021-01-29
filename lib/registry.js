const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const BUCKET_FN = "bucket.yml";

const parseFlowContents = (contents) =>
  contents
    ? {
        id: contents.identifier,
        comments: contents.comments,
        processors: parseProcessors(contents.processors),
      }
    : {};

const parseProcessGroups = (processGroups = []) =>
  processGroups.map((pg) => ({
    id: pg.identifier,
    name: pg.name,
    comments: pg.comments,
  }));

const parseProcessors = (processors = []) =>
  processors.map((p) => ({
    id: p.identifier,
    name: p.name,
    bundle: p.bundle
      ? `${p.bundle.group}.${p.bundle.artifact}-${p.bundle.version}`
      : "",
    type: p.type,
    comments: p.comments,
    properties: p.properties,
  }));

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
            ...yaml.load(fs.readFileSync(path.join(dir, "bucket.yml"), "utf8")),
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
      const contents =
        data && data.content && data.content.flowSnapshot
          ? data.content.flowSnapshot.flowContents
          : {};
      flows.push({
        id: key,
        name: flow.flowName,
        description: flow.flowDesc,
        comments: flow.comments,
        version: flow.ver,
        contents: parseFlowContents(contents),
      });
    }
  }
  return flows;
};
