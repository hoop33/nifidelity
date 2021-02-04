const { createFlowDocument } = require("./../lib/document");

describe("createFlowDocument", () => {
  it("should return blank when no flow", () => {
    expect(createFlowDocument()).toBe("");
  });

  it("should return blank when flow is empty", () => {
    expect(createFlowDocument({})).toBe("");
  });

  it("should return document with front matter", () => {
    expect(
      createFlowDocument({
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
      })
    ).toBe(`---
id: 123
title: 'Flow: My Flow'
---
_Version 3: This is a test_

`);
  });

  it("should return document with process groups when process groups specified", () => {
    const doc = createFlowDocument({
      id: "123",
      name: "My Flow",
      comments: "This is a test",
      version: 3,
      content: {
        flowSnapshot: {
          flowContents: {
            processGroups: [
              {
                name: "pg1",
              },
              {
                name: "pg2",
                versionedFlowCoordinates: {},
              },
              {
                name: "pg3",
                versionedFlowCoordinates: {
                  flowId: "flow1",
                },
              },
            ],
          },
        },
      },
    });
    expect(
      doc.includes(`## Process Groups

* [pg1](#)
* [pg2](#)
* [pg3](flow1)
`)
    ).toBeTruthy();
  });

  it("should return document with processors when processors specified", () => {
    const doc = createFlowDocument({
      id: "123",
      name: "My Flow",
      comments: "This is a test",
      version: 3,
      content: {
        flowSnapshot: {
          flowContents: {
            processors: [
              {},
              {
                name: "My Proc 1",
                type: "com.example.nifi.MyProc",
              },
              {
                name: "My Proc 2",
                bundle: {
                  artifact: "my-nar",
                  version: "1.0.0",
                },
                comments: "My comments",
                properties: {
                  prop1: "foo",
                  prop2: "bar",
                },
                type: "com.example.nifi.MyProc",
              },
            ],
          },
        },
      },
    });
    expect(
      doc.includes(`## Processors

### (unknown)

### My Proc 1

### My Proc 2

> My comments

**my-nar-1.0.0 &mdash; com.example.nifi.MyProc**

#### Properties

| Name | Value |
| --- | --- |
| prop1 | \`foo\` |
| prop2 | \`bar\` |
`)
    ).toBeTruthy();
  });

  it("should return document with no errors when errors is empty", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
      },
      null,
      {}
    );
    expect(
      doc.includes(`## Errors
`)
    ).toBeFalsy();
  });

  it("should return document with errors when errors", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
      },
      null,
      { field1: ["required", "too long"] }
    );
    expect(
      doc.includes(`## Errors

**field1**

* required
* too long

`)
    ).toBeTruthy();
  });

  it("should return document with no mermaid when mermaid but no connections", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
        content: {
          flowSnapshot: {
            flowContents: {},
          },
        },
      },
      "START CONTENTS STOP"
    );
    expect(doc.includes("START")).toBeFalsy();
  });

  it("should return document with no mermaid when mermaid and connections with no source or destination", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
        content: {
          flowSnapshot: {
            flowContents: {
              connections: [{}],
              processors: [
                { identifier: "123", name: "a" },
                { identifier: "456", name: "b" },
              ],
            },
          },
        },
      },
      "START CONTENTS STOP"
    );
    expect(doc.includes("START")).toBeFalsy();
  });

  it("should return document with no mermaid when mermaid and connections but no processors", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
        content: {
          flowSnapshot: {
            flowContents: {
              connections: [
                {
                  source: {
                    id: "123",
                  },
                  destination: {
                    id: "456",
                  },
                },
              ],
            },
          },
        },
      },
      "START CONTENTS STOP"
    );
    expect(doc.includes("START")).toBeFalsy();
  });

  it("should return document with mermaid when mermaid and connections and processors", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
        content: {
          flowSnapshot: {
            flowContents: {
              connections: [
                {
                  source: {
                    id: "123",
                  },
                  destination: {
                    id: "456",
                  },
                  selectedRelationships: ["foo", "bar"],
                },
              ],
              processors: [
                { identifier: "123", name: "a" },
                { identifier: "456", name: "b" },
              ],
            },
          },
        },
      },
      "START CONTENTS STOP"
    );
    expect(
      doc.includes(`START graph TB
123[a]-->|foo, bar|456[b]
 STOP`)
    ).toBeTruthy();
  });

  it("should return document with mermaid when mermaid and connections and processors but no relationships", () => {
    const doc = createFlowDocument(
      {
        id: "123",
        name: "My Flow",
        comments: "This is a test",
        version: 3,
        content: {
          flowSnapshot: {
            flowContents: {
              connections: [
                {
                  source: {
                    id: "123",
                  },
                  destination: {
                    id: "456",
                  },
                },
              ],
              processors: [
                { identifier: "123", name: "a" },
                { identifier: "456", name: "b" },
              ],
            },
          },
        },
      },
      "START CONTENTS STOP"
    );
    expect(
      doc.includes(`START graph TB
123[a]-->||456[b]
 STOP`)
    ).toBeTruthy();
  });
});
