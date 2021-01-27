const { toHeader } = require("./../lib/markdown");

describe("toHeader", () => {
  it("should be blank when text not specified", () => {
    expect(toHeader()).toBe("");
  });

  it("should default to 1 when level not specified", () => {
    expect(toHeader("Hello")).toBe("# Hello\n\n");
  });

  it("should format level correctly when specified", () => {
    expect(toHeader("Hello", 4)).toBe("#### Hello\n\n");
  });
});
