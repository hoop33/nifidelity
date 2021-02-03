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

const mapProcessors = (processors = []) => {
  const map = {};
  for (const processor of processors) {
    map[processor.identifier] = processor;
  }
  return map;
};

const writeFlowContents = (handle, contents = {}) => {
  if (
    contents.content &&
    contents.content.flowSnapshot &&
    contents.content.flowSnapshot.flowContents
  ) {
    const data = contents.content.flowSnapshot.flowContents;
    writeMermaid(handle, data.connections, mapProcessors(data.processors));
    writeProcessGroups(handle, data.processGroups);
    writeProcessors(handle, data.processors);
  }
};

const writeMermaid = (handle, connections = [], processors = {}) => {
  if (connections.length) {
    let chart = "graph TB\n";
    for (const connection of connections) {
      const source = processors[(connection.source || {}).id];
      const destination = processors[(connection.destination || {}).id];
      if (source && destination) {
        chart += `${source.identifier}[${source.name}]-->|${(
          connection.selectedRelationships || []
        ).join(", ")}|${destination.identifier}[${destination.name}]\n`;
      }
    }

    handle.write("import Mermaid from '@theme/Mermaid';\n\n");
    handle.write(`<Mermaid chart={\`${chart}\`}/>\n\n`);
  }
};

const writeProcessGroups = (handle, groups = {}) => {
  if (groups.length) {
    handle.write(markdown.toHeader("Process Groups", 2));
    const list = [];
    for (const group of groups) {
      list.push(
        markdown.toLink(
          group.name,
          group.versionedFlowCoordinates
            ? `flow-${group.versionedFlowCoordinates.flowId}`
            : "#"
        )
      );
    }
    handle.write(markdown.toList(list));
  }
};

const writeProcessors = (handle, processors = {}) => {
  if (processors.length) {
    handle.write(markdown.toHeader("Processors", 2));
    for (const processor of processors) {
      handle.write(markdown.toHeader(processor.name, 3));
      handle.write(markdown.toItalic(processor.identifier));
      handle.write("\n\n");
      handle.write(markdown.toBlockquote(processor.comments));
      handle.write(
        markdown.toBold(
          `${
            processor.bundle
              ? processor.bundle.artifact +
                "-" +
                processor.bundle.version +
                " &mdash; "
              : ""
          }${processor.type}`
        )
      );
      handle.write("\n\n");
      writeProperties(handle, processor.properties);
    }
  }
};

const writeProperties = (handle, properties) => {
  if (properties) {
    handle.write(markdown.toHeader("Properties", 4));
    handle.write(markdown.toTableHeader(["Name", "Value"]));
    for (const prop in properties) {
      handle.write(
        markdown.toTableRow([prop, markdown.toInlineCode(properties[prop])])
      );
    }
    handle.write("\n");
  }
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
        handle.write(markdown.toHeader("Flows", 2));
        const list = [];
        for (const flow of flowFiles || []) {
          list.push(`${markdown.toLink(flow.name, flow.fileName)}\n`);
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
    writeFlow: function (flow) {
      if (flow) {
        const id = flow.id || nanoid.nanoid();
        const fileName = `flow-${id}.md`;
        const name = flow.name || UNKNOWN;
        const handle = fs.createWriteStream(path.resolve(this.path, fileName), {
          flags: "w",
        });
        handle.write(
          markdown.toFrontMatter({
            id: `flow-${id}`,
            title: `'Flow: ${name}'`,
          })
        );
        handle.write(markdown.toBlockquote(flow.description || UNKNOWN));
        handle.write(
          markdown.toItalic(
            `Version ${flow.version || UNKNOWN}: ${flow.comments || UNKNOWN}`
          )
        );
        handle.write("\n\n");
        writeFlowContents(handle, flow.contents);

        return { fileName, name };
      }
    },
  };
};
