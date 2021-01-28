exports.toBlockquote = (str) =>
  str ? `> ${str.replace(/\n/g, "\n> ")}\n\n` : "";

exports.toBold = (str) => (str ? `**${str}**` : "");

exports.toHeader = (str, level = 1) =>
  str ? `${"#".repeat(level)} ${str}\n\n` : "";

exports.toItalic = (str) => (str ? `_${str}_` : "");

exports.toList = (arr) =>
  arr
    ? arr
        .map((item) => `* ${item}`)
        .join("\n")
        .concat("\n\n")
    : "";
