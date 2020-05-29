import fetch from "node-fetch";

const $get = async (path: string, headers = {}) => {
  const res = await fetch(`http://localhost:8080${path}`, {
    headers,
  });
  return res;
};

describe("GET /check", () => {
  it("should return 401 w/o header", async () => {
    const res = await $get("/check");
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ invalid header", async () => {
    const res = await $get("/check", { Authorization: "invalid" });
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ valid header but expired", async () => {
    const res = await $get("/check", { Authorization: "Bearer bar" });
    expect(res.status).toBe(401);
  });

  it("should return 200 w/ valid header", async () => {
    const res = await $get("/check", { Authorization: "Bearer foo" });
    expect(res.status).toBe(200);
  });
});

describe("GET /track", () => {
  it("should return 401 w/o header", async () => {
    const res = await $get("/track");
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ invalid header", async () => {
    const res = await $get("/track", { Authorization: "invalid" });
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ valid header but expired", async () => {
    const res = await $get("/track", { Authorization: "Bearer bar" });
    expect(res.status).toBe(401);
  });

  it("should return 400 w/ valid header but schema violation", async () => {
    const res = await $get("/track", { Authorization: "Bearer foo" });
    expect(res.status).toBe(400);

    const res2 = await $get("/track?path", { Authorization: "Bearer foo" });
    expect(res2.status).toBe(400);

    const res3 = await $get("/track?path=non-audio.mp4", {
      Authorization: "Bearer foo",
    });
    expect(res3.status).toBe(400);
  });

  it("should return 400 w/ valid header but file does not exists", async () => {
    const res = await $get("/track?path=undef.mp3", {
      Authorization: "Bearer foo",
    });
    expect(res.status).toBe(400);
  });

  it("should return 200 w/ valid header and params", async () => {
    const res = await $get("/track?path=sample.mp3", {
      Authorization: "Bearer foo",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-type")).toBe("audio/mpeg");

    const res2 = await $get("/track?path=/nest/sample.mp3", {
      Authorization: "Bearer foo",
    });
    expect(res2.status).toBe(200);
    expect(res2.headers.get("Content-type")).toBe("audio/mpeg");
  });
});
