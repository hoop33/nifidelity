exports.toBlockquote = (str) =>
  str ? `> ${str.replace(/\n/g, "\n> ")}\n\n` : "";

exports.toBold = (str) => (str ? `**${str}**` : "");

exports.toHeader = (str, level = 1) =>
  str ? `${"#".repeat(level)} ${str}\n\n` : "";

exports.toInlineCode = (str) => (str ? "`" + str + "`" : "");

exports.toItalic = (str) => (str ? `_${str}_` : "");

exports.toLink = (title, link) => `[${title}](${link})`;

exports.toList = (arr) =>
  arr
    ? arr
        .map((item) => `* ${item}`)
        .join("\n")
        .concat("\n\n")
    : "";

exports.toTableHeader = (arr) =>
  arr && arr.length
    ? `${exports.toTableRow(arr)}${exports.toTableRow(
        new Array(arr.length).fill("---")
      )}`
    : "";

exports.toTableRow = (arr) =>
  arr && arr.length ? `| ${arr.join(" | ")} |\n` : "";
