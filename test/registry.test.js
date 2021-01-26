const mock = require("mock-fs");
const { getBuckets } = require("../lib/registry");

afterEach(() => {
  mock.restore();
});

describe("getBuckets", () => {
  it("should return empty when no directories", () => {
    mock({
      "/var": {},
    });
    expect(getBuckets("/var")).toEqual([]);
  });

  it("should return empty when no bucket directories", () => {
    mock({
      "/var": {
        test: {
          "hello.txt": "hello",
        },
      },
    });
    expect(getBuckets("/var")).toEqual([]);
  });

  it("should return buckets when source contains bucket directories", () => {
    mock({
      "/var": {
        bucket1: {
          "bucket.yml": "bucketId: 123",
        },
        bucket2: {
          "bucket.yml": "bucketId: 456",
        },
      },
    });
    const buckets = getBuckets("/var");
    expect(buckets.length).toBe(2);
  });

  it("should return bucket data when bucket is found", () => {
    mock({
      "/var": {
        bucket: {
          "bucket.yml": `
flows:
  fffc7f99-adf0-4a4e-8a19-abbfd1bf915f: {ver: 2, file: Shout_It_Out.snapshot, comments: 'feat:
      don''t ignore hidden files', author: anonymous, created: 1611685692748, flowName: Shout
      It Out, flowDesc: 'This flow monitors an input directory for new files, converts
      them to social shouting, and moves the resulting FlowFiles to an output directory.'}
  279212ae-c2c1-4c84-958f-d8d07b47296d: {ver: 1, file: Textual_Playground.snapshot,
    comments: Initial version, author: anonymous, created: 1611684019396, flowName: Textual
      Playground, flowDesc: Contains other processor groups that play with text.}
  ecf77196-585a-41e9-abea-5b729418d9ba: {ver: 2, file: Turtle_to_GraphDB.snapshot,
    comments: Don't create output directories, author: anonymous, created: 1611685302720,
    flowName: Turtle to GraphDB, flowDesc: Picks up Turtle files and sends them to
      GraphDB}
  c322ff83-1d93-4b36-992a-d66cd1d88672: {ver: 2, file: Flower_Fixer.snapshot, comments: 'feat:
      use variables for search-flower and replace-flower', author: anonymous, created: 1610637186711,
    flowName: Flower Fixer, flowDesc: Changes all instances of "Daisy" or "daisy"
      in an incoming FlowFile to "Chrysanthemum"}
layoutVer: 1
bucketId: 2d3a0236-0a90-4369-8cf8-95ec672718e6
`,
        },
      },
    });
    const buckets = getBuckets("/var");
    expect(buckets.length).toBe(1);

    const bucket = buckets[0];
    expect(bucket.path).toBe("/var/bucket");
    expect(bucket.bucketId).toBe("2d3a0236-0a90-4369-8cf8-95ec672718e6");
    expect(bucket.layoutVer).toBe(1);

    const flow = bucket.flows["fffc7f99-adf0-4a4e-8a19-abbfd1bf915f"];
    expect(flow).not.toBe(null);
    expect(flow.ver).toBe(2);
    expect(flow.file).toBe("Shout_It_Out.snapshot");
  });
});
