import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app";

describe("createApp", () => {
  it("GET / отвечает", async () => {
    const res = await request(createApp()).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("ok");
  });
});
