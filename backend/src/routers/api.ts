import express from "express";
import room from "./room";
import { RedisPool, getKeys, roomExpiry } from "../redis";

const api = express.Router();

api.param("roomId", (req, res, next, roomId) => {
  next();
  RedisPool.acquire().then((client) => {
    client.multi()
      .expire(getKeys(roomId).config, roomExpiry)
      .expire(getKeys(roomId).tx, roomExpiry)
      .expire(getKeys(roomId).txid, roomExpiry)
      .exec(() => {
        RedisPool.release(client);
      });
  });
});

api.get("/", (req, res) => res.send("healthy"));
api.use("/room/:roomId", room);

api.use("/*", (req, res) => res.sendStatus(404));

export default api;
