const { createFlowDocument } = require("./../lib/document");

describe("createFlowDocument", () => {
  it("should return blank when no flow", () => {
    expect(createFlowDocument()).toBe("");
  });

  it("should return blank when flow is empty", () => {
    expect(createFlowDocument({})).toBe("");
  });
});
