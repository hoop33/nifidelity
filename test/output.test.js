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
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
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
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    expect(createOutput("/var", true)).toBeTruthy();
  });

  it("should create output directory when it does not exist", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    expect(fs.existsSync("foo")).toBeFalsy();
    expect(createOutput("foo")).toBeTruthy();
    expect(fs.existsSync("foo")).toBeTruthy();
  });
});
