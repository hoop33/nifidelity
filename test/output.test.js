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

describe("output.writeBucket", () => {
  it("should not throw when bucket is not specified", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    const out = createOutput("foo");
    expect(() => {
      out.writeBucket();
    }).not.toThrow();
  });

  it("should not throw when bucket is empty", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    const out = createOutput("foo");
    expect(() => {
      out.writeBucket({});
    }).not.toThrow();
  });

  it("should not throw when bucket is specified", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    const out = createOutput("foo");
    expect(() => {
      out.writeBucket({ bucketId: "123" }, [{ name: "foo", fileName: "bar" }]);
    }).not.toThrow();
  });
});

describe("output.writeErrors", () => {
  it("should not throw when errors is not specified", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    const out = createOutput("foo");
    expect(() => {
      out.writeErrors();
    }).not.toThrow();
  });

  it("should not throw when errors is empty", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    const out = createOutput("foo");
    expect(() => {
      out.writeErrors("foo", "bar", {});
    }).not.toThrow();
  });

  it("should not throw when errors is specified", () => {
    mock();
    fs.createWriteStream = function (path, options) {
      return {
        write: function () {},
      };
    };
    const out = createOutput("foo");
    expect(() => {
      out.writeErrors("foo", "bar", { f1: ["e1", "e2"], f2: ["e3", "e4"] });
    }).not.toThrow();
  });
});
