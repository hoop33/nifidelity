exports.toBlockquote = (str) =>
  str ? `> ${str.replace(/\n/g, "\n> ")}\n\n` : "";

exports.toHeader = (str, level = 1) =>
  str ? `${"#".repeat(level)} ${str}\n\n` : "";

exports.toList = (arr) =>
  arr
    ? arr
        .map((item) => `* ${item}`)
        .join("\n")
        .concat("\n\n")
    : "";
