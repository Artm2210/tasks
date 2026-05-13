import express from "express";

export function createApp() {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("ok");
  });
  return app;
}
