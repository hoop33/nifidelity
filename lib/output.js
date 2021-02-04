const fs = require("fs");
const path = require("path");
const nanoid = require("nanoid");

const markdown = require("./markdown");

const BUCKETS_FILE = "buckets.md";
const ERROR_FILE = "errors.md";
const UNKNOWN = "(unknown)";

const createMarkdown = (path, id, title) => {
  const handle = fs.createWriteStream(path, { flags: "w" });
  handle.write(markdown.toFrontMatter({ id, title }));
};

exports.createOutput = (target, overwrite) => {
  const out = path.resolve(target);

  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  if (!overwrite && fs.readdirSync(out).length)
    throw `output directory '${out}' not empty`;

  // Create the errors and buckets files that we'll later append to
  createMarkdown(path.resolve(out, ERROR_FILE), "errors", "Errors");
  createMarkdown(path.resolve(out, BUCKETS_FILE), "buckets", "Buckets");

  return {
    path: out,
    writeBucket: function (bucket, flowFiles) {
      if (bucket) {
        const handle = fs.createWriteStream(path.resolve(out, BUCKETS_FILE), {
          flags: "a",
        });
        handle.write(markdown.toHeader(bucket.name, 2));
        const list = [];
        for (const flow of flowFiles || []) {
          list.push(
            `${markdown.toLink(flow.name, flow.fileName)}${
              flow.errors ? " (errors)" : ""
            }\n`
          );
        }
        handle.write(markdown.toList(list));
      }
    },
    writeErrors: function (type, name, id, errors) {
      const handle = fs.createWriteStream(path.resolve(out, ERROR_FILE), {
        flags: "a",
      });
      handle.write(markdown.toHeader(`${type} ${name || UNKNOWN}`, 2));
      handle.write(markdown.toItalic(id || UNKNOWN));
      handle.write("\n\n");
      for (const field in errors) {
        handle.write(markdown.toHeader(field, 3));
        handle.write(markdown.toList(errors[field]));
      }
    },
  };
};
