exports.toHeader = (str, level = 1) =>
  str ? `${"#".repeat(level)} ${str}\n\n` : "";
