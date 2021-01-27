exports.toHeader = (str, level = 1) =>
  str ? `${"#".repeat(level)} ${str}\n\n` : "";

exports.toList = (arr) =>
  (arr || [])
    .map((item) => `* ${item}`)
    .join("\n")
    .concat("\n\n");
