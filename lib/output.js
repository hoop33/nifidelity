const fs = require("fs");
const path = require("path");
const { toHeader, toList } = require("./markdown");

const ERROR_FILE = "errors.md";

const createOutputFile = (path, title) => {
  const handle = fs.createWriteStream(path, { flags: "w" });
  handle.write(toHeader(title));
};

exports.createOutput = (target, overwrite) => {
  const out = path.resolve(target);

  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  if (!overwrite && fs.readdirSync(out).length)
    throw `output directory '${out}' not empty`;

  return {
    path: out,
    errorHandle: createOutputFile(path.resolve(out, ERROR_FILE), "Errors"),
    writeErrors: function (type, id, errors) {
      const handle = fs.createWriteStream(path.resolve(this.path, ERROR_FILE), {
        flags: "a",
      });
      handle.write(toHeader(`${type} ${id || "unknown"}`, 2));
      for (const field in errors) {
        handle.write(toHeader(field, 3));
        handle.write(toList(errors[field]));
      }
    },
  };
};
