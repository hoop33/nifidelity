const fs = require("fs");
const path = require("path");

exports.createOutput = (target, overwrite) => {
  const out = path.resolve(target);

  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  const files = fs.readdirSync(out);

  if (!overwrite && files.length) throw `output directory '${out}' not empty`;

  return {
    path: out,
  };
};
