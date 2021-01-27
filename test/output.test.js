const fs = require("fs");
const mock = require("mock-fs");
const { createOutput } = require("./../lib/output");

afterEach(() => {
  mock.restore();
});

describe("createOutput", () => {
  it("should throw when overwrite is false and target not empty", () => {
    mock({
      "/var": {
        "hello.txt": "hello",
      },
    });
    expect(() => {
      createOutput("/var");
    }).toThrow("output directory '/var' not empty");
  });

  it("should succeed when overwrite is true and target not empty", () => {
    mock({
      "/var": {
        "hello.txt": "hello",
      },
    });
    expect(createOutput("/var", true)).toBeTruthy();
  });

  it("should create output directory when it does not exist", () => {
    mock();
    expect(fs.existsSync("foo")).toBeFalsy();
    expect(createOutput("foo")).toBeTruthy();
    expect(fs.existsSync("foo")).toBeTruthy();
  });
});
