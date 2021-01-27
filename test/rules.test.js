const { validateBucket } = require("./../lib/rules");

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
