const { toBlockquote, toHeader, toList } = require("./../lib/markdown");

describe("toBlockquote", () => {
  it("should be blank when text not specified", () => {
    expect(toBlockquote()).toBe("");
  });

  it("should format correctly when text is specified", () => {
    expect(toBlockquote("hello")).toBe("> hello\n\n");
  });

  it("should start each line with gt when multiline", () => {
    expect(toBlockquote("hello\nhi\nhow are you?")).toBe(`> hello
> hi
> how are you?

`);
  });
});

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

describe("toList", () => {
  it("should be blank when list not specified", () => {
    expect(toList()).toBe("");
  });

  it("should create list when specified", () => {
    expect(toList(["apple", "baker", "charlie"])).toBe(`* apple
* baker
* charlie

`);
  });
});
