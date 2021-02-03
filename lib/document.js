const markdown = require("./markdown");

const getFrontMatter = (flow) =>
  markdown.toFrontMatter({
    id: flow.id,
    title: `'Flow: ${flow.name}'`,
  });

const getHeader = (flow) =>
  markdown.toBlockquote(flow.description) +
  markdown.toItalic(`Version ${flow.version}: ${flow.comments}`) +
  "\n\n";

const getErrors = (errors = {}) => {
  let text = "";
  if (errors.length) {
    text += markdown.toHeader("Errors", 2);
  }
  for (const field in errors) {
    text += markdown.toBold(field);
    text += "\n\n";
    text += markdown.toList(errors[field]);
  }
  return text;
};

const getContent = (content = {}, mermaid) => {
  let text = "";
  if (content.flowSnapshot && content.flowSnapshot.flowContents) {
    const data = content.flowSnapshot.flowContents;
    if (mermaid) text += getMermaid(mermaid, data.connections, data.processors);
    text += getProcessGroups(data.processGroups);
    text += getProcessors(data.processors);
  }
  return text;
};

const getMermaid = (mermaid, connections = [], processors = []) => {
  if (connections.length) {
    const procs = processors.reduce(
      (map, obj) => ((map[obj.identifier] = obj), map),
      {}
    );

    let chart = "graph TB\n";
    for (const connection of connections) {
      const source = procs[(connection.source || {}).id];
      const destination = procs[(connection.destination || {}).id];
      if (source && destination) {
        chart += `${source.identifier}[${source.name}]-->|${(
          connection.selectedRelationships || []
        ).join(", ")}|${destination.identifier}[${destination.name}]\n`;
      }
    }
    return `${mermaid.replace("CONTENTS", chart)}\n\n`;
  }
  return "";
};

const getProcessGroups = (groups = []) =>
  groups.length
    ? markdown.toHeader("Process Groups", 2) +
      markdown.toList(
        groups.map((group) =>
          markdown.toLink(
            group.name,
            group.versionedFlowCoordinates
              ? group.versionedFlowCoordinates.flowId
              : "#"
          )
        )
      )
    : "";

const getProcessors = (processors = []) => {
  if (!processors.length) return "";

  let text = markdown.toHeader("Processors", 2);
  for (const processor of processors) {
    text += markdown.toHeader(processor.name, 3);
    text += markdown.toItalic(processor.identifier);
    text += "\n\n";
    text += markdown.toBlockquote(processor.comments);
    text += markdown.toBold(
      `${
        processor.bundle
          ? processor.bundle.artifact +
            "-" +
            processor.bundle.version +
            " &mdash; "
          : ""
      }${processor.type}`
    );
    text += "\n\n";
    text += getProperties(processor.properties);
  }
  return text;
};

const getProperties = (properties = {}) =>
  properties
    ? markdown.toHeader("Properties", 4) +
      markdown.toTableHeader(["Name", "Value"]) +
      Object.entries(properties)
        .map(([name, value]) =>
          markdown.toTableRow([name, markdown.toInlineCode(value)])
        )
        .join("") +
      "\n"
    : "";

exports.createFlowDocument = (flow, mermaid, errors) =>
  flow && flow.id
    ? getFrontMatter(flow) +
      getHeader(flow) +
      getErrors(errors) +
      getContent(flow.content, mermaid)
    : "";
