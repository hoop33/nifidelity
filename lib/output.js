const fs = require("fs");
const path = require("path");
const nanoid = require("nanoid");

const markdown = require("./markdown");

const REGISTRY_FILE = "registry.md";
const ERROR_FILE = "errors.md";
const UNKNOWN = "(unknown)";

const createMarkdown = (path, id, title, content) => {
  const handle = fs.createWriteStream(path, { flags: "w" });
  handle.write(markdown.toFrontMatter({ id, title }));
  content && handle.write(content);
};

exports.createOutput = (target, overwrite) => {
  const out = path.resolve(target);

  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  if (!overwrite && fs.readdirSync(out).length)
    throw `output directory '${out}' not empty`;

  // Create the index and errors files that we'll later append to
  createMarkdown(path.resolve(out, ERROR_FILE), "errors", "Errors");
  createMarkdown(
    path.resolve(out, REGISTRY_FILE),
    "registry",
    "NiFi Registry",
    `${markdown.toHeader(
      markdown.toLink("Errors", ERROR_FILE),
      2
    )}${markdown.toHeader("Buckets", 2)}`
  );

  return {
    path: out,
    writeBucket: function (bucket, flowFiles) {
      if (bucket) {
        const handle = fs.createWriteStream(path.resolve(out, REGISTRY_FILE), {
          flags: "a",
        });
        handle.write(markdown.toHeader(bucket.name, 3));
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
