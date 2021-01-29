const {
  toBlockquote,
  toBold,
  toHeader,
  toInlineCode,
  toItalic,
  toList,
  toTableHeader,
  toTableRow,
} = require("./../lib/markdown");

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

describe("toBold", () => {
  it("should be blank when text not specified", () => {
    expect(toBold()).toBe("");
  });

  it("should be in bold format when specified", () => {
    expect(toBold("hello")).toBe("**hello**");
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

describe("toInlineCode", () => {
  it("should be blank when text not specified", () => {
    expect(toInlineCode()).toBe("");
  });

  it("should be in inline code format when specified", () => {
    expect(toInlineCode("hello")).toBe("`hello`");
  });
});

describe("toItalic", () => {
  it("should be blank when text not specified", () => {
    expect(toItalic()).toBe("");
  });

  it("should be in italic format when specified", () => {
    expect(toItalic("hello")).toBe("_hello_");
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

describe("toTableHeader", () => {
  it("should be blank when array not specified", () => {
    expect(toTableHeader()).toBe("");
  });

  it("should be blank when array is empty", () => {
    expect(toTableHeader([])).toBe("");
  });

  it("should have fields when array is specified", () => {
    expect(toTableHeader(["apple", "baker", "charlie"]))
      .toBe(`| apple | baker | charlie |
| --- | --- | --- |
`);
  });
});

describe("toTableRow", () => {
  it("should be blank when array not specified", () => {
    expect(toTableRow()).toBe("");
  });

  it("should be blank when array is empty", () => {
    expect(toTableRow([])).toBe("");
  });

  it("should have fields when array is specified", () => {
    expect(toTableRow(["apple", "baker", "charlie"]))
      .toBe(`| apple | baker | charlie |
`);
  });
});
