const { validateBucket, validateFlow } = require("./../lib/rules");

describe("validateBucket", () => {
  it("should fail when bucket is not defined", () => {
    expect(validateBucket().fails()).toBeTruthy();
  });

  it("should fail when bucket is empty", () => {
    expect(validateBucket({}).fails()).toBeTruthy();
  });

  it("should fail when bucket has no id", () => {
    expect(validateBucket({ path: "abc" }).fails()).toBeTruthy();
  });

  it("should fail when bucket has invalid id", () => {
    expect(validateBucket({ bucketId: "?", path: "abc" }).fails()).toBeTruthy();
  });

  it("should fail when bucket has no path", () => {
    expect(validateBucket({ bucketId: "abc-123" }).fails()).toBeTruthy();
  });

  it("should fail when bucket has invalid path", () => {
    expect(
      validateBucket({ bucketId: "abc-123", path: 7 }).fails()
    ).toBeTruthy();
  });

  it("should pass when bucket is valid", () => {
    expect(
      validateBucket({ bucketId: "abc-123", path: "abc/123" }).passes()
    ).toBeTruthy();
  });
});

describe("validateFlow", () => {
  it("should fail when flow is not defined", () => {
    expect(validateFlow().fails()).toBeTruthy();
  });

  it("should fail when flow is empty", () => {
    expect(validateFlow({}).fails()).toBeTruthy();
  });

  it("should fail when flow has no id", () => {
    expect(
      validateFlow({
        name: "my flow",
        description: "my description",
        comments: "my comments",
        version: 1,
        file: "my_file.snapshot",
      }).fails()
    ).toBeTruthy();
  });

  it("should fail when flow has invalid id", () => {
    expect(
      validateFlow({
        id: "?",
        name: "my flow",
        description: "my description",
        comments: "my comments",
        version: 1,
        file: "my_file.snapshot",
      }).fails()
    ).toBeTruthy();
  });

  it("should fail when flow name is too short", () => {
    expect(
      validateFlow({
        id: "abc-123",
        name: "my",
        description: "my description",
        comments: "my comments",
        version: 1,
        file: "my_file.snapshot",
      }).fails()
    ).toBeTruthy();
  });

  it("should pass when flow is valid", () => {
    expect(
      validateFlow({
        id: "abc-123",
        name: "my name",
        description: "my description",
        comments: "my comments",
        version: 1,
        file: "my_file.snapshot",
      }).passes()
    ).toBeTruthy();
  });
});
